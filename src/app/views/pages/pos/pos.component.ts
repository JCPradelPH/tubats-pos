import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs';
import { FirestoreService } from '../../../services/firestore.service';
import { UtilsService } from '../../../services/utils.service';
import { AppState } from '../../../core/reducers';
import { Store, select } from '@ngrx/store';
import { startWith, map, tap, filter } from 'rxjs/operators';
import { UUID } from 'angular2-uuid';
import { Order, OrderItem, posSelector, SetPaymenSucceededStatus } from '../../../core/pos';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { MatSnackBar, MatDialog } from '@angular/material';
import { CheckoutDialogComponent } from './checkout-dialog/checkout-dialog.component';

@Component({
	selector: 'kt-pos',
	templateUrl: './pos.component.html',
	styleUrls: ['./pos.component.scss']
})
export class PosComponent implements OnInit {

	mainForm: FormGroup;
	loading: boolean = false;
	formFields: Object = {
		menuItems: new FormControl({ value: '', disabled: false }),
	};
	menuItems = [];
	orders = [];
	filteredOptions: Observable<Object[]>;
	selectedItemId: string;
	selectedItemName: string;
	selectedItemDescription: string;
	selectedItemPrice: string;
	selectedItemCategory: string;
	selectedItemCategoryId: string;
	selectedMenuInventoryItems: Object[];
	quantity: number = 1;
	total: number = 0;
	totalStr: string = "0.00";

	constructor(
		private firestoreService: FirestoreService,
		private utilService: UtilsService,
		private fb: FormBuilder,
		private store: Store<AppState>,
		private firebaseAuth: AngularFireAuth,
		private snackBar: MatSnackBar,
		private dialog: MatDialog,
	) { }

	ngOnInit() {
		this.store.subscribe((state) => {
			console.log(state)
			if (!state['posSelector'].paymentSucceeded) return;
			this.reloadEntities();
			this.orders = [];
			this.total = 0;
			this.totalStr = "0.00";
			this.store.dispatch(new SetPaymenSucceededStatus({ paymentSucceeded: false }));
			this.snackBar.open(`Order Complete!`, '', { duration: 3000 });
		})
		this.mainForm = this.fb.group(this.formFields);
		this.initPicklist();
		
	}

	initPicklist() {
		this.firestoreService.getDocuments('item_menus').subscribe(rows => {
			this.menuItems = this.utilService.mapObjectToPicklist(rows, undefined, ["categoryId", "categoryName", "description", "price", "inventoryItems"]);
			this.filteredOptions = this.formFields["menuItems"].valueChanges.pipe(
				startWith(''),
				map((val: string) => this.filter(val))
			);
		});
	}

	filter(val: string): object[] {
		return this.menuItems.filter(option => {
			return option["name"].toLowerCase().indexOf(val.toLowerCase()) === 0 || 
				option["categoryName"].toLowerCase().indexOf(val.toLowerCase()) === 0;
		});
	}

	onMenuItemSelected(event) {
		console.log(event.option)
		this.selectedItemId = event.option.id.id;
		this.selectedItemName = event.option.id.name;
		this.selectedItemDescription = event.option.id.description;
		this.selectedItemPrice = parseFloat(event.option.id.price).toFixed(2);
		this.selectedItemCategory = event.option.id.categoryName;
		this.selectedItemCategoryId = event.option.id.categoryId;
		this.selectedMenuInventoryItems = event.option.id.inventoryItems;
	}

	changeQuantity(addend: number) {
		if (this.quantity == 1 && addend == -1) return;
		this.quantity = this.quantity + addend;
	}

	addOrder() {
		const existingOrder = this.orders.filter(order => order.itemId === this.selectedItemId)
		if (existingOrder.length > 0) {
			const orders = this.orders.map(order => {
				if (order.itemId === this.selectedItemId) {
					const quantity = order["quantity"] + this.quantity;
					order["quantity"] = quantity;
					order["totalPrice"] = this.utilService.commaSeparated((parseFloat(order["itemPrice"]) * quantity));
					order["menuInventoryItems"] = this.selectedMenuInventoryItems.map(inventoryItem => {
						inventoryItem["quantity"] = inventoryItem["quantity"] * this.quantity;
						return inventoryItem;
					});
				}
				return order;
			});
			this.orders = orders;
		} else {
			this.orders.push({
				id: UUID.UUID(),
				itemId: this.selectedItemId,
				itemName: this.selectedItemName,
				itemDescription: this.selectedItemDescription,
				itemPrice: this.selectedItemPrice,
				itemCategory: this.selectedItemCategory,
				itemCategoryId: this.selectedItemCategoryId,
				menuInventoryItems: this.selectedMenuInventoryItems.map(item => {
					item["quantity"] = item["quantity"] * this.quantity;
					return item;
				}),
				quantity: this.quantity,
				totalPrice: this.utilService.commaSeparated((parseFloat(this.selectedItemPrice) * this.quantity)),
			});
		}
		
		this.reloadEntities();
		this.computeTotal();
	}

	removeOrder(itemId: string = "") {
		const cachedOrders = this.orders;
		this.orders = cachedOrders.filter(order => order.itemId !== itemId);
		this.total = this.orders.reduce((prev = 0, val) => {
			prev = prev + (val["itemPrice"] * val["quantity"]);
			return prev;
		}, 0);
		this.computeTotal();
	}

	computeTotal() {
		this.total = this.orders.reduce((prev = 0, val) => {
			prev = prev + (val["itemPrice"] * val["quantity"]);
			return prev;
		}, 0);
		this.totalStr = this.total > 0 ? this.utilService.commaSeparated(this.total) : "0.00";
	}

	openCheckoutDialog() {
		this.dialog.open(CheckoutDialogComponent, {
			data: { title: "Order Checkout", total: this.total, orders: this.orders },
			width: '600px'
		});
	}

	reloadEntities() {
		this.selectedItemId = '';
		this.selectedItemName = '';
		this.selectedItemDescription = '';
		this.selectedItemPrice = '';
		this.selectedItemCategory = '';
		this.selectedItemCategoryId = '';
		this.selectedMenuInventoryItems = [];
		this.mainForm.controls["menuItems"].setValue("");
		this.mainForm.controls["menuItems"].patchValue("");
		this.quantity = 1;
		this.initPicklist();
	}

}
