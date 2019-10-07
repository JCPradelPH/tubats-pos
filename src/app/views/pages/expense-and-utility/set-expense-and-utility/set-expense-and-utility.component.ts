import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FirestoreService } from '../../../../services/firestore.service';
import { UtilsService } from '../../../../services/utils.service';
import { startWith, map, tap } from 'rxjs/operators';
import { Observable, from } from 'rxjs';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { ExpenseAndUtility } from '../../../../core/expense-and-utility';
import { UUID } from 'angular2-uuid';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatSnackBar } from '@angular/material';

@Component({
	selector: 'kt-set-expense-and-utility',
	templateUrl: './set-expense-and-utility.component.html',
	styleUrls: ['./set-expense-and-utility.component.scss']
})
export class SetExpenseAndUtilityComponent implements OnInit {

	mainForm: FormGroup;
	loading: boolean = false;
	formFields: Object = {
		name: ['', Validators.compose([Validators.required,])],
		amount: ['', Validators.compose([Validators.required,])],
		description: [''],
		transactionDate: [new Date(), Validators.compose([Validators.required,])],
		inventoryItems: new FormControl(),
		quantity: new FormControl(),
	};
	inventoryItems = [];
	inventoryItemId: string;
	inventoryItemUnitName: string;
	quantity: number = 1;
	filteredOptions: Observable<Object[]>;

	editId: string;
	errors: any = [];
	collectionName: string = "expenses_and_utilities";
	redirectPath: string = "/expense-and-utility";
	categoryId: string;
	expenseId: string;
	expenseName: string;
	createdAt: string;
	createdAtMillis: number;
	createdBy: string;
	updatedBy: string;
	updatedAt: string;
	categories: Observable<Object[]>;
	expenses: Observable<Object[]>;
	expensesList: Object[];

	constructor(
		private router: Router,
		private firestoreService: FirestoreService,
		private utilService: UtilsService,
		private fb: FormBuilder,
		private firebaseAuth: AngularFireAuth,
		private firestore: AngularFirestore,
		private snackBar: MatSnackBar,
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
		this.initCategoryPicklist();
	}

	initExistingData() {
		this.firestoreService.getDocumentById(this.collectionName, this.editId).subscribe(
			(data) => {
				if (data !== undefined) {
					// set default picklist data
					this.initCategoryPicklist(data["expenseCategoryId"]);
					this.createdBy = data["createdBy"];
					this.updatedBy = data["updatedBy"];
					this.createdAtMillis = data["createdAt"];
					this.createdAt = this.convertDateToReadable(data["createdAt"]);
					this.updatedAt = this.convertDateToReadable(data["updatedAt"]);
					this.mainForm.patchValue(data)
					this.mainForm.controls["transactionDate"].setValue(new Date(data["transactionDate"]))
					this.mainForm.controls["transactionDate"].patchValue(new Date(data["transactionDate"]))

					this.expenseName = data["name"];
					if (data["expenseCategoryId"] === 'tSvxtv8qLvZ8XxD8Ykqq') {
						this.inventoryItemId = data["inventoryItemId"];
						this.inventoryItemUnitName = data["inventoryItemUnitName"];
						this.quantity = data["inventoryItemQuantity"];
						this.initInventoryForm();
						return;
					}
					if (data["expenseCategoryId"] === 'C1Vh5cszcq7qb8p2cT9l') {
						this.expenseId = data["recurringExpenseId"];
						this.initRecurringExpensePicklist(data["recurringExpenseId"]);
						return;
					}
				}
			}
		);
	}

	convertDateToReadable(date: number): string {
		const theDate = new Date(date);
		return theDate.toString();
	}

	initCategoryPicklist(categoryId: string = undefined) {
		this.categories = from(this.firestoreService.getDocuments('expense_categories').pipe(
			tap(rows => {
				console.log(rows)
				if (this.editId === undefined) {
					this.categoryId = rows[0]["id"];
					this.initRecurringExpensePicklist();
					return;
				}
				this.categoryId = categoryId;
			}),
			map(rows => this.utilService.mapObjectToPicklist(rows))
		));
	}

	initRecurringExpensePicklist(expenseId: string = undefined) {
		this.expenses = from(this.firestoreService.getDocuments('recurring_expenses').pipe(
			tap(rows => {
				this.expensesList = rows;
				if (this.editId === undefined) {
					this.expenseId = rows[0]["id"];
					this.expenseName = rows[0]["name"];
					return;
				}
				this.expenseId = expenseId;
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

	onExpenseCategorySelected(event) {
		this.categoryId = event;
		this.inventoryItemId = "";
		this.inventoryItemUnitName = "";
		this.mainForm.controls['inventoryItems'].setValue('');
		this.mainForm.controls['inventoryItems'].patchValue('');
		this.mainForm.controls['name'].setValue('');
		this.mainForm.controls['name'].patchValue('');
		this.mainForm.controls['amount'].setValue('');
		this.mainForm.controls['amount'].patchValue('');
		this.mainForm.controls['description'].setValue('');
		this.mainForm.controls['description'].patchValue('');
		this.quantity = 1;
		if (this.categoryId === 'tSvxtv8qLvZ8XxD8Ykqq') {
			this.initInventoryForm();
			return;
		}
		if (this.categoryId === 'C1Vh5cszcq7qb8p2cT9l') {
			this.initRecurringExpensePicklist();
			return;
		}
		console.log(`🚧		${this.categoryId}`)
		console.log(`🚧		${event}`)
	}

	onRecurringExpenseSelected(event) {
		this.expenseId = event;
		this.expenseName = this.expensesList.filter(expense => expense['id'] === this.expenseId)[0]['name'];
	}

	initInventoryForm() {
		// this.mainForm = this.fb.group(this.formFields);
		this.formFields["quantity"].valueChanges.subscribe(val => this.quantity = val);
		this.initInventoryPicklist();
	}

	initInventoryPicklist() {
		this.firestoreService.getDocuments('inventory').subscribe(rows => {
			this.inventoryItems = this.utilService.mapObjectToPicklist(rows, undefined, ["unitName"]);
			if(this.editId === undefined) {
				this.inventoryItemId = rows[0]["id"];
				this.inventoryItemUnitName = rows[0]["unitName"];
			}
			
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
		this.inventoryItemUnitName = event.option.id.unitName;
		this.expenseName = event.option.id.name;
		console.log(event.option)
	}

	changeQuantity(addend: number) {
		if (this.quantity == 1 && addend == -1) return;
		this.quantity = this.quantity + addend;
	}

	async submit() {
		const controls = this.mainForm.controls;
		console.log(this.mainForm.invalid);

		/** check form */
		if (this.categoryId === 'uJjV12p2ornYZhNvYA8Y') {
			if (this.mainForm.invalid) {
				Object.keys(controls).forEach(controlName =>
					controls[controlName].markAsTouched()
				);
				return;
			}
		}

		if (this.categoryId === 'tSvxtv8qLvZ8XxD8Ykqq') {
			if (this.inventoryItemId === "" || this.inventoryItemId === undefined || 
				controls['amount'].value === '' || controls['amount'].value === undefined) {
				this.snackBar.open(`Incomplete information`, '', { duration: 3000 });
				return;
				}
		}

		if (this.categoryId === 'C1Vh5cszcq7qb8p2cT9l') {
			if (this.expenseId === "" || this.expenseId === undefined || 
				controls['amount'].value === '' || controls['amount'].value === undefined) {
				this.snackBar.open(`Incomplete information`, '', { duration: 3000 });
				return;
				}
		}
		

		this.loading = true;

		const expenseAndUtility: ExpenseAndUtility = new ExpenseAndUtility();
		expenseAndUtility.id = this.editId || UUID.UUID();
		expenseAndUtility.name = this.categoryId === 'uJjV12p2ornYZhNvYA8Y' ? controls['name'].value : this.expenseName;
		expenseAndUtility.expenseCategoryId = this.categoryId || "";
		expenseAndUtility.transactionDate = new Date(controls['transactionDate'].value).getTime();
		expenseAndUtility.readableTransactionDate = this.utilService.formatDate(new Date(controls["transactionDate"].value));
		if (this.categoryId === 'C1Vh5cszcq7qb8p2cT9l') {
			expenseAndUtility.recurringExpenseId = this.expenseId === undefined ? "" : this.expenseId;
		}
		if (this.categoryId === 'tSvxtv8qLvZ8XxD8Ykqq') {
			expenseAndUtility.inventoryItemUnitName = this.inventoryItemUnitName === undefined ? "" : this.inventoryItemUnitName;
			expenseAndUtility.inventoryItemId = this.inventoryItemId === undefined ? "" : this.inventoryItemId;
			expenseAndUtility.inventoryItemQuantity = this.quantity === undefined ? 0 : this.quantity;
		}
		expenseAndUtility.amount = controls['amount'].value;
		expenseAndUtility.description = controls['description'].value;
		expenseAndUtility.createdBy = this.editId === undefined ? this.firebaseAuth.auth.currentUser.email : this.createdBy;
		expenseAndUtility.updatedAt = new Date().getTime();
		expenseAndUtility.createdAt = this.editId === undefined ? new Date().getTime() : this.createdAtMillis;
		expenseAndUtility.updatedBy = this.firebaseAuth.auth.currentUser.email;
		console.table(expenseAndUtility.toMap())

		this.firestoreService.setDocument(
			this.firestore.collection(this.collectionName).doc(expenseAndUtility.id),
			expenseAndUtility,
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
