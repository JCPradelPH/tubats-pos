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
		this.dataSource = new ExpenseAndUtilityListDataSource(this.firestoreService);
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
