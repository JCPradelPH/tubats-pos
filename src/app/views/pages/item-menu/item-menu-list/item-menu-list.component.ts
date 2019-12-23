import { Component, OnInit, ViewChild } from '@angular/core';
import { ItemMenuListDataSource } from './item-menu-list.data-source';
import { MatPaginator, MatSort } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { ItemMenu } from '../../../../core/item-menu';
import { QueryParamsModel, LayoutUtilsService } from '../../../../core/_base/crud';
import { Router } from '@angular/router';
import { FirestoreService } from '../../../../services/firestore.service';
import { merge } from 'rxjs';
import { tap } from 'rxjs/operators';

@Component({
	selector: 'kt-item-menu-list',
	templateUrl: './item-menu-list.component.html',
	styleUrls: ['./item-menu-list.component.scss']
})
export class ItemMenuListComponent implements OnInit {

	dataSource: ItemMenuListDataSource;
	displayedColumns = ['name', 'price', 'actions'];
	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
	selection = new SelectionModel<ItemMenu>(true, []);

	collectionName: string = "item_menus";
	deleteModalTitle: string = "Delete Item";
	putScreenPath: string = "item-menu/set-item-menu";

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
		this.dataSource = new ItemMenuListDataSource(this.firestoreService);
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
			this.paginator.pageSize
		);
		this.dataSource.loadItems(queryParams);
		this.selection.clear();
	}

	showUpdateDialog(data) {
		this.router.navigateByUrl(`${this.putScreenPath}?id=${data.id}`);
	}

}
