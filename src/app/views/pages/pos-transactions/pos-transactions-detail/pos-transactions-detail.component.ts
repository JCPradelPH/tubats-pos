import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirestoreService } from '../../../../services/firestore.service';
import { UtilsService } from '../../../../services/utils.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';
import { tap, map } from 'rxjs/operators';

@Component({
	selector: 'kt-pos-transactions-detail',
	templateUrl: './pos-transactions-detail.component.html',
	styleUrls: ['./pos-transactions-detail.component.scss']
})
export class PosTransactionsDetailComponent implements OnInit {

	loading = false;
	initialLoading = true;
	editId: string;
	createdAt: string;
	createdAtMillis: number;
	createdBy: string;
	updatedBy: string;
	updatedAt: string;
	amountTendered: number;
	change: number;
	total: number;
	tableNumber: number;
	readableTransactionDate: string;
	orderItems: Observable<Object[]>;

	constructor(
		private router: Router,
		private firestoreService: FirestoreService,
		private firestore: AngularFirestore,
		private utilService: UtilsService,
	) { }

	ngOnInit() {
		this.initForm();
	}

	initForm() {
		this.editId = this.utilService.getParameterByName('id') || undefined;
		if (this.editId !== undefined) {
			this.initExistingData();
			return;
		}
		this.router.navigateByUrl(`pos-transactions`);
	}
	
	initExistingData() {
		this.firestoreService.getDocumentById('orders', this.editId).subscribe(
			(data) => {
				if (data !== undefined) {
					// set default picklist data
					this.createdBy = data["createdBy"];
					this.updatedBy = data["updatedBy"];
					this.createdAtMillis = data["createdAt"];
					this.amountTendered = data["amountTendered"];
					this.change = data["change"];
					this.total = data["total"];
					this.tableNumber = data["tableNumber"];
					this.readableTransactionDate = data["readableTransactionDate"];
					this.createdAt = this.convertDateToReadable(data["createdAt"]);
					this.updatedAt = this.convertDateToReadable(data["updatedAt"]);
					this.initOrderItems();
				}
			}
		);
	}

	initOrderItems() {
		this.orderItems = from(
			this.firestoreService.getDocuments(`orders/${this.editId}/order_items`)
				// .pipe(
				// 	tap(rows => {
				// 		if (this.editId === undefined) {
				// 			this.categoryId = rows[0]["id"];
				// 			return;
				// 		}
				// 		this.categoryId = categoryId;
				// 	}),
				// 	map(rows => this.utilService.mapObjectToPicklist(rows))
				// )
		)
	}

	convertDateToReadable(date: number): string {
		const theDate = new Date(date);
		return theDate.toString();
	}

	formatDateChar(char: number) {
		return char.toString().length == 1 ? `0${char.toString()}` : char.toString();
	}

}
