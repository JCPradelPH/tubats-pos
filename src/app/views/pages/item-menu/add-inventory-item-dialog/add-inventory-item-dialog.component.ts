import { Component, OnInit, Inject, Output, EventEmitter } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { FirestoreService } from '../../../../services/firestore.service';
import { UtilsService } from '../../../../services/utils.service';
import { startWith, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../core/reducers';
import { MenuInventoryItem, AddMenuInventoryItem } from '../../../../core/menu_inventory_item';

@Component({
	selector: 'kt-add-inventory-item-dialog',
	templateUrl: './add-inventory-item-dialog.component.html',
	styleUrls: ['./add-inventory-item-dialog.component.scss']
})

export class AddInventoryItemDialogComponent implements OnInit {

	mainForm: FormGroup;
	formFields: Object = {
		inventoryItems: new FormControl(),
		quantity: new FormControl(),
	};
	viewLoading: boolean = false;
	loadingAfterSubmit: boolean = false;
	inventoryItems = [];
	inventoryItemId: string;
	inventoryItemName: string;
	inventoryItemUnitId: string;
	inventoryItemUnitName: string;
	quantity: number = 1;
	filteredOptions: Observable<Object[]>;

	constructor(
		public dialogRef: MatDialogRef<AddInventoryItemDialogComponent>,
		private firestoreService: FirestoreService,
		private utilService: UtilsService,
		private fb: FormBuilder,
		private store: Store<AppState>,
		@Inject(MAT_DIALOG_DATA) public data: any) { }

	ngOnInit() {
		this.viewLoading = true;
		this.mainForm = this.fb.group(this.formFields);
		this.formFields["quantity"].valueChanges.subscribe(val => this.quantity = val);
		this.initPicklist();
	}

	onNoClick(): void {
		this.dialogRef.close();
	}

	addMenuInventoryItem() {
		this.viewLoading = true;
		this.loadingAfterSubmit = true;
		const menuInventoryItem: MenuInventoryItem = new MenuInventoryItem();
		menuInventoryItem.inventoryItemId = this.inventoryItemId;
		menuInventoryItem.inventoryItemName = this.inventoryItemName;
		menuInventoryItem.inventoryItemUnitId = this.inventoryItemUnitId;
		menuInventoryItem.inventoryItemUnitName = this.inventoryItemUnitName;
		menuInventoryItem.quantity = this.quantity;
		this.store.dispatch(new AddMenuInventoryItem({ menuInventoryItem }));
		this.dialogRef.close();
	}

	initPicklist() {
		this.firestoreService.getDocuments('inventory').subscribe(rows => {
			this.inventoryItems = this.utilService.mapObjectToPicklist(rows, undefined, ["unitId", "unitName"]);
			this.inventoryItemId = rows[0]["id"];
			this.viewLoading = false;
			this.filteredOptions = this.formFields["inventoryItems"].valueChanges.pipe(
				startWith(''),
				map((val: string) => this.filter(val))
			);
		});
	}

	filter(val: string): object[] {
		return this.inventoryItems.filter(option => option["name"].toLowerCase().indexOf(val.toLowerCase()) === 0);
	}

	onInventoryItemSelected(event) {
		this.inventoryItemId = event.option.id.id;
		this.inventoryItemName = event.option.id.name;
		this.inventoryItemUnitId = event.option.id.unitId;
		this.inventoryItemUnitName = event.option.id.unitName;
		console.log(event.option)
	}

	changeQuantity(addend: number) {
		if(this.quantity == 1 && addend == -1) return; 
		this.quantity = this.quantity + addend;
	}

}
