import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { FirestoreService } from '../../../../services/firestore.service';
import { UtilsService } from '../../../../services/utils.service';
import { Inventory } from '../../../../core/inventory';
import { UUID } from 'angular2-uuid';
import { AngularFireAuth } from '@angular/fire/auth';
import { MatDialog } from '@angular/material';
import { Observable, from } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Component({
	selector: 'kt-set-inventory',
	templateUrl: './set-inventory.component.html',
	styleUrls: ['./set-inventory.component.scss']
})
export class SetInventoryComponent implements OnInit {

	mainForm: FormGroup;
	units: Observable<Object[]>;
	loading = false;
	initialLoading = true;
	errors: any = [];
	collectionName: string = "inventory";
	redirectPath: string = "/inventory";

	formFields: Object = {
		id: [''],
		name: ['', Validators.compose([Validators.required,])],
		stock: ['', Validators.compose([Validators.required,])],
	};
	editId: string;
	unitId: string;
	createdAt: string;
	createdAtMillis: number;
	createdBy: string;
	updatedBy: string;
	updatedAt: string;

	constructor(
		private router: Router,
		private fb: FormBuilder,
		private firestoreService: FirestoreService,
		private firestore: AngularFirestore,
		private utilService: UtilsService,
		private firebaseAuth: AngularFireAuth,
		private dialog: MatDialog
	) { }

	ngOnInit() {
		this.initForm();
	}

	initForm() {
		this.editId = this.utilService.getParameterByName('id') || undefined;
		this.mainForm = this.fb.group(this.formFields);
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
					// set default picklist data
					this.initPicklist(data["unitId"]);
					this.createdBy = data["createdBy"];
					this.updatedBy = data["updatedBy"];
					this.createdAtMillis = data["createdAt"];
					this.createdAt = this.convertDateToReadable(data["createdAt"]);
					this.updatedAt = this.convertDateToReadable(data["updatedAt"]);
					this.mainForm.patchValue(data)
				}
			}
		);
	}

	convertDateToReadable(date: number) : string {
		const theDate = new Date(date);
		return theDate.toString();
	}

	formatDateChar(char: number) {
		return char.toString().length == 1 ? `0${char.toString()}` : char.toString();
	}

	initPicklist(unitId: string = undefined) {
		this.units = from(this.firestoreService.getDocuments('unit_of_measurements').pipe(
			tap(rows => {
				if (this.editId === undefined) {
					this.unitId = rows[0]["id"];
					return;
				}
				this.unitId = unitId;
			}),
			map(rows => this.utilService.mapObjectToPicklist(rows))
		));
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

	onUnitSelected(event) {
		this.unitId = event;
		console.log(`🚧		${this.unitId}`)
		console.log(`🚧		${event}`)
	}
	
	openItemDialog() {
		const statuses = [];
		const messages = [];
		// this.dialog.open(ItemDialogComponent, {
		// 	data: { title: "Add Related Item", statuses, messages },
		// 	width: '480px'
		// });
	}

	async submit() {
		const controls = this.mainForm.controls;

		/** check form */
		if (this.mainForm.invalid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);
			return;
		}

		this.loading = true;

		const inventory: Inventory = new Inventory();
		inventory.id = this.editId || UUID.UUID();
		inventory.name = controls['name'].value;
		inventory.stock = controls['stock'].value;
		inventory.unitId = this.unitId;
		inventory.createdBy = this.editId === undefined ? this.firebaseAuth.auth.currentUser.email : this.createdBy;
		inventory.updatedAt = new Date().getTime();
		inventory.createdAt = this.editId === undefined ? new Date().getTime() : this.createdAtMillis;
		inventory.updatedBy = this.firebaseAuth.auth.currentUser.email;
		console.table(inventory.toMap())

		this.firestoreService.setDocument(
			this.firestore.collection(this.collectionName).doc(inventory.id),
			inventory,
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


}
