import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { RecurringExpense } from '../../../../core/recurring-expense';
import { QueryParamsModel, LayoutUtilsService } from '../../../../core/_base/crud';
import { Router } from '@angular/router';
import { FirestoreService } from '../../../../services/firestore.service';
import { merge } from 'rxjs';
import { tap } from 'rxjs/operators';
import { RecurringExpenseListDataSource } from './recurring-expense.data-source';

@Component({
	selector: 'kt-recurring-expense-list',
	templateUrl: './recurring-expense-list.component.html',
	styleUrls: ['./recurring-expense-list.component.scss']
})
export class RecurringExpenseListComponent implements OnInit {

	dataSource: RecurringExpenseListDataSource;
	displayedColumns = ['name', 'actions'];
	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
	selection = new SelectionModel<RecurringExpense>(true, []);

	collectionName: string = "recurring_expenses";
	putScreenPath: string = "recurring-expense/set-recurring-expense";

	constructor(
		private layoutUtilsService: LayoutUtilsService,
		private router: Router,
		private firestoreService: FirestoreService,
	) { }

	ngOnInit() {
		this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

		merge(this.sort.sortChange, this.paginator.page)
			.pipe(
				tap(() => {
					this.loadItems();
				})
			)
			.subscribe();

		// Init DataSource
		this.dataSource = new RecurringExpenseListDataSource(this.firestoreService);
		// First load
		this.loadItems(true);
	}

	/**
	 * Load items
	 *
	 * @param firstLoad: boolean
	 */
	loadItems(firstLoad: boolean = false) {
		const queryParams = new QueryParamsModel(
			{},
			this.sort.direction,
			this.sort.active,
			this.paginator.pageIndex,
			firstLoad ? 6 : this.paginator.pageSize
		);
		this.dataSource.loadItems(queryParams);
		this.selection.clear();
	}

	showUpdateDialog(data) {
		this.router.navigateByUrl(`${this.putScreenPath}?id=${data.id}`);
	}

}
