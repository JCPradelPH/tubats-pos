import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { MatDialog } from '@angular/material';
import { FirestoreService } from '../../../../services/firestore.service';
import { UtilsService } from '../../../../services/utils.service';
import { ItemMenu } from '../../../../core/item-menu';
import { UUID } from 'angular2-uuid';
import { AddInventoryItemDialogComponent } from '../add-inventory-item-dialog/add-inventory-item-dialog.component';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../../core/reducers';
import { menuInventoryItem, MenuInventoryItem, AddMenuInventoryItem } from '../../../../core/menu_inventory_item';
import { tap, map } from 'rxjs/operators';
import { from, Observable } from 'rxjs';

@Component({
	selector: 'kt-set-item-menu',
	templateUrl: './set-item-menu.component.html',
	styleUrls: ['./set-item-menu.component.scss']
})
export class SetItemMenuComponent implements OnInit {

	mainForm: FormGroup;
	categories: Observable<Object[]>;
	menuInventoryItemsObs: Observable<MenuInventoryItem[]> = undefined;
	menuInventoryItems: MenuInventoryItem[] = [];
	loading = false;
	initialLoading = true;
	errors: any = [];
	collectionName: string = "item_menus";
	redirectPath: string = "/item-menu";

	formFields: Object = {
		id: [''],
		name: ['', Validators.compose([Validators.required,])],
		price: ['', Validators.compose([Validators.required,])],
		description: [''],
	};
	editId: string;
	categoryId: string;
	createdAt: string;
	createdAtMillis: number;
	createdBy: string;
	updatedAt: string;
	updatedBy: string;
	itemMenuId: string;

	constructor(
		private router: Router,
		private fb: FormBuilder,
		private firestoreService: FirestoreService,
		private firestore: AngularFirestore,
		private utilService: UtilsService,
		private firebaseAuth: AngularFireAuth,
		private dialog: MatDialog,
		private store: Store<AppState>
	) { }

	ngOnInit() {
		this.menuInventoryItemsObs = this.store.pipe(
			select(menuInventoryItem),
			map((menuInventoryItem: MenuInventoryItem) => {
				console.log('store subscription!')
				if (menuInventoryItem !== undefined && menuInventoryItem.inventoryItemId !== undefined) {
					this.menuInventoryItems.push(menuInventoryItem);
				}
				return this.menuInventoryItems
			})
		)
		this.initForm();
	}

	initForm() {
		this.editId = this.utilService.getParameterByName('id') || undefined;
		this.mainForm = this.fb.group(this.formFields);
		this.itemMenuId = this.editId || UUID.UUID();
		if (this.editId !== undefined) {
			this.initExistingData();
			return;
		}
		this.initPicklist();
	}

	initExistingData() {
		this.firestoreService.getDocumentById(this.collectionName, this.editId).subscribe(
			(data) => {
				if (data !== undefined) {
					this.initPicklist(data["categoryId"]);
					this.createdBy = data["createdBy"];
					this.updatedBy = data["updatedBy"];
					this.createdAtMillis = data["createdAt"];
					this.createdAt = this.convertDateToReadable(data["createdAt"]);
					this.updatedAt = this.convertDateToReadable(data["updatedAt"]);
					this.mainForm.patchValue(data)
					this.menuInventoryItems = data["inventoryItems"];
					this.store.dispatch(new AddMenuInventoryItem({ menuInventoryItem: new MenuInventoryItem() }));
				}
			}
		);
	}

	convertDateToReadable(date: number): string {
		const theDate = new Date(date);
		return theDate.toString();
	}

	formatDateChar(char: number) {
		return char.toString().length == 1 ? `0${char.toString()}` : char.toString();
	}

	initPicklist(categoryId: string = undefined) {
		this.categories = from(
			this.firestoreService.getDocuments('menu_categories')
				.pipe(
					tap(rows => {
						if (this.editId === undefined) {
							this.categoryId = rows[0]["id"];
							return;
						}
						this.categoryId = categoryId;
					}),
					map(rows => this.utilService.mapObjectToPicklist(rows))
				)
		)
	}

	isControlHasError(controlName: string, validationType: string): boolean {
		const control = this.mainForm.controls[controlName];
		if (!control) {
			return false;
		}

		const result =
			control.hasError(validationType) &&
			(control.dirty || control.touched);
		return result;
	}

	onCategorySelected(event) {
		this.categoryId = event;
		console.log(`🚧		${this.categoryId}`)
		console.log(`🚧		${event}`)
	}

	openItemDialog() {
		this.dialog.open(AddInventoryItemDialogComponent, {
			data: { title: "Add Inventory Item", itemMenuId: this.itemMenuId },
			width: '600px'
		});
	}

	async submit() {
		const controls = this.mainForm.controls;

		console.log(`this.mainForm.invalid: ${this.mainForm.invalid}`)
		console.log(`name: ${this.mainForm.controls['name'].value}`)
		console.log(`price: ${this.mainForm.controls['price'].value}`)
		console.log(`description: ${this.mainForm.controls['description'].value}`)

		/** check form */
		if (this.mainForm.invalid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);
			return;
		}

		this.loading = true;

		const itemMenu: ItemMenu = new ItemMenu();
		itemMenu.id = this.itemMenuId;
		itemMenu.name = controls['name'].value;
		itemMenu.description = controls['description'].value;
		itemMenu.price = controls['price'].value;
		itemMenu.categoryId = this.categoryId;
		itemMenu.inventoryItems = this.menuInventoryItems.map((menuInventoryItem) => {
			return {
				inventoryItemId: menuInventoryItem.inventoryItemId,
				inventoryItemName: menuInventoryItem.inventoryItemName,
				inventoryItemUnitId: menuInventoryItem.inventoryItemUnitId,
				inventoryItemUnitName: menuInventoryItem.inventoryItemUnitName,
				quantity: menuInventoryItem.quantity,
			}
		});
		itemMenu.createdBy = this.editId === undefined ? this.firebaseAuth.auth.currentUser.email : this.createdBy;
		itemMenu.updatedAt = new Date().getTime();
		itemMenu.createdAt = this.editId === undefined ? new Date().getTime() : this.createdAtMillis;
		itemMenu.updatedBy = this.firebaseAuth.auth.currentUser.email;
		console.table(itemMenu.toMap())

		this.firestoreService.setDocument(
			this.firestore.collection(this.collectionName).doc(itemMenu.id),
			itemMenu,
			this.editId != undefined
		).then((_) => {
			this.loading = false;
			this.router.navigateByUrl(this.redirectPath);
		}).catch(this.onError)

	}

	onError(e) {
		console.log(e)
		this.loading = false;
	}

	removeChip(itemMenu) {
		const itemMenus = this.menuInventoryItems.filter(item => item.inventoryItemId !== itemMenu.inventoryItemId);
		this.menuInventoryItems = itemMenus;
		console.table(this.menuInventoryItems)
		this.store.dispatch(new AddMenuInventoryItem({ menuInventoryItem: new MenuInventoryItem() }));
	}


}
