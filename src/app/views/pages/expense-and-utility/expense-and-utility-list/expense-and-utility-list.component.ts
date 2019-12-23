import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { ExpenseAndUtility } from '../../../../core/expense-and-utility';
import { QueryParamsModel, LayoutUtilsService } from '../../../../core/_base/crud';
import { Router } from '@angular/router';
import { FirestoreService } from '../../../../services/firestore.service';
import { merge } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ExpenseAndUtilityListDataSource } from './expense-and-utility.data-source';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';

@Component({
	selector: 'kt-expense-and-utility-list',
	templateUrl: './expense-and-utility-list.component.html',
	styleUrls: ['./expense-and-utility-list.component.scss']
})
export class ExpenseAndUtilityListComponent implements OnInit {


	dataSource: ExpenseAndUtilityListDataSource;
	displayedColumns = ['name', 'amount', 'readableTransactionDate', 'actions'];
	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
	selection = new SelectionModel<ExpenseAndUtility>(true, []);

	collectionName: string = "expenses_and_utilities";
	putScreenPath: string = "expense-and-utility/set-expense-and-utility";

	mainForm: FormGroup;
	formFields: Object = {
		startDate: [new Date(), Validators.compose([Validators.required,])],
		endDate: [new Date(), Validators.compose([Validators.required,])],
	};
	loading: boolean = false;

	constructor(
		private fb: FormBuilder,
		private router: Router,
		private firestoreService: FirestoreService,
	) { }

	ngOnInit() {
		this.mainForm = this.fb.group(this.formFields);
		this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
		merge(this.sort.sortChange, this.paginator.page)
			.pipe(
				tap(() => {
					this.loadItems();
				})
			)
			.subscribe();
		this.dataSource = new ExpenseAndUtilityListDataSource(this.firestoreService);
	}

	search() {
		this.dataSource = new ExpenseAndUtilityListDataSource(this.firestoreService);
		this.loading = true
		this.loadItems();
	}

	/**
	 * Load items
	 *
	 * @param firstLoad: boolean
	 */
	async loadItems() {
		const controls = this.mainForm.controls;

		if (this.mainForm.invalid) return;

		const startDate: number = new Date(controls['startDate'].value).getTime()
		const endDate: number = new Date(controls['endDate'].value).getTime()
		const queryParams = new QueryParamsModel(
			{},
			this.sort.direction,
			this.sort.active,
			this.paginator.pageIndex,
			this.paginator.pageSize
		);
		console.log(`startDate: ${startDate}`)
		console.log(`endDate: ${endDate}`)
		await this.dataSource.loadItems(queryParams, startDate, endDate);
		this.selection.clear();
		this.loading = false
	}

	showUpdateDialog(data) {
		this.router.navigateByUrl(`${this.putScreenPath}?id=${data.id}`);
	}

}
