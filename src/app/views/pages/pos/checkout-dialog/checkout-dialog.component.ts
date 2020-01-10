import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FirestoreService } from '../../../../services/firestore.service';
import { UtilsService } from '../../../../services/utils.service';
import { startWith, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../core/reducers';
import { UUID } from 'angular2-uuid';
import { Order, OrderItem, SetPaymenSucceededStatus } from '../../../../core/pos';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
	selector: 'kt-checkout-dialog',
	templateUrl: './checkout-dialog.component.html',
	styleUrls: ['./checkout-dialog.component.scss']
})
export class CheckoutDialogComponent implements OnInit {

	mainForm: FormGroup;
	formFields: Object = {
		transactionDate: [new Date(), Validators.compose([Validators.required,])],
		amountTendered: [0, Validators.compose([Validators.required,])],
		tableNumber: ['', Validators.compose([Validators.required,])],
	};
	viewLoading: boolean = false;
	loadingAfterSubmit: boolean = false;
	inventoryItems = [];
	inventoryItemId: string;
	inventoryItemName: string;
	inventoryItemUnitId: string;
	inventoryItemUnitName: string;
	filteredOptions: Observable<Object[]>;
	amountTendered: number = 0;
	changeStr: string = '0';
	changeVal: number = 0;
	totalStr: string = '0';

	constructor(
		public dialogRef: MatDialogRef<CheckoutDialogComponent>,
		private firestoreService: FirestoreService,
		private utilService: UtilsService,
		private fb: FormBuilder,
		private store: Store<AppState>,
		private firebaseAuth: AngularFireAuth,
		private firestore: AngularFirestore,
		private snackBar: MatSnackBar,
		@Inject(MAT_DIALOG_DATA) public data: any) { }

	ngOnInit() {
		this.mainForm = this.fb.group(this.formFields);
		this.totalStr = this.utilService.commaSeparated(this.data.total);
		this.mainForm.controls["amountTendered"].valueChanges.subscribe(val => {
			this.amountTendered = val;
			this.changeVal = this.amountTendered - this.data.total > -1 ? this.amountTendered - this.data.total : 0;
			this.changeStr = this.utilService.commaSeparated(this.changeVal);
		});
	}

	onNoClick(): void {
		this.dialogRef.close();
	}

	checkout() {
		
		if (this.mainForm.controls["tableNumber"].value === "" || this.mainForm.controls["tableNumber"].value === undefined) {
			this.snackBar.open(`Invalid transaction values. Kindly check the values of your transaction`, '', { duration: 3000 });
			return;
		}
		
		// if (this.mainForm.controls["tableNumber"].value === "" || this.mainForm.controls["tableNumber"].value === undefined ||
		// 	this.amountTendered === 0 || this.amountTendered === undefined || this.amountTendered < this.data.total) {
		// 	this.snackBar.open(`Invalid transaction values. Kindly check the values of your transaction`, '', { duration: 3000 });
		// 	return;
		// }
		this.viewLoading = true;
		this.loadingAfterSubmit = true;
		const orderId: string = UUID.UUID();
		const order: Order = new Order();
		order.id = orderId;
		order.total = this.data.total;
		order.createdBy = this.firebaseAuth.auth.currentUser.email;
		order.updatedAt = new Date().getTime();
		order.createdAt = new Date().getTime();
		order.updatedBy = this.firebaseAuth.auth.currentUser.email;
		order.transactionDate = new Date(this.mainForm.controls["transactionDate"].value).getTime()
		order.readableTransactionDate = this.utilService.formatDate(new Date(this.mainForm.controls["transactionDate"].value));
		order.tableNumber = this.mainForm.controls["tableNumber"].value;
		order.amountTendered = this.amountTendered;
		order.change = this.changeVal;

		this.firestoreService.setDocument(
			this.firestore.collection('orders').doc(order.id),
			order,
			false
		).then((_) => {
			const orderItemTransactions: Promise<any>[] = this.data.orders.map(orderItemMap => {
				const orderItem: OrderItem = new OrderItem();
				orderItemMap.orderId = order.id;
				return this.firestoreService.setDocument(
					this.firestore
						.collection('orders').doc(order.id)
						.collection('order_items').doc(orderItemMap.id),
					orderItem.fromMap(orderItemMap),
					false
				)
			});
			Promise.all(orderItemTransactions)
				.then(() => {
					console.log("success")
					this.viewLoading = false;
					this.loadingAfterSubmit = false;
					this.store.dispatch(new SetPaymenSucceededStatus({ paymentSucceeded: true }));
					this.dialogRef.close();
				})
				.catch(this.onError)
		}).catch(this.onError)
	}

	onError(e) {
		console.log(e)
		this.viewLoading = false;
		this.loadingAfterSubmit = false;
	}

}
