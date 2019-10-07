import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { MatDialog } from '@angular/material';
import { FirestoreService } from '../../../../services/firestore.service';
import { UtilsService } from '../../../../services/utils.service';
import { MenuCategory } from '../../../../core/menu-category';
import { UUID } from 'angular2-uuid';

@Component({
	selector: 'kt-set-menu-category',
	templateUrl: './set-menu-category.component.html',
	styleUrls: ['./set-menu-category.component.scss']
})
export class SetMenuCategoryComponent implements OnInit {

	mainForm: FormGroup;
	units: Object[];
	loading = false;
	initialLoading = true;
	errors: any = [];
	collectionName: string = "menu_categories";
	redirectPath: string = "/menu-category";

	formFields: Object = {
		id: [''],
		name: ['', Validators.compose([Validators.required,])],
	};
	editId: string;
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
	}

	initExistingData() {
		this.firestoreService.getDocumentById(this.collectionName, this.editId).subscribe(
			(data) => {
				if (data !== undefined) {
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

	convertDateToReadable(date: number): string {
		const theDate = new Date(date);
		return theDate.toString();
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

		const category: MenuCategory = new MenuCategory();
		category.id = this.editId || UUID.UUID();
		category.name = controls['name'].value;
		category.createdBy = this.editId === undefined ? this.firebaseAuth.auth.currentUser.email : this.createdBy;
		category.updatedAt = new Date().getTime();
		category.updatedBy = this.firebaseAuth.auth.currentUser.email;
		category.createdAt = this.editId === undefined ? new Date().getTime() : this.createdAtMillis;
		console.table(category.toMap())

		this.firestoreService.setDocument(
			this.firestore.collection(this.collectionName).doc(category.id),
			category,
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
