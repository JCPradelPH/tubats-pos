import { Component, OnInit, ViewChild } from '@angular/core';
import { InventoryListDataSource } from './inventory-list.data-source';
import { MatPaginator, MatSort } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { Inventory } from '../../../../core/inventory';
import { QueryParamsModel, LayoutUtilsService } from '../../../../core/_base/crud';
import { Router } from '@angular/router';
import { FirestoreService } from '../../../../services/firestore.service';
import { merge } from 'rxjs';
import { tap } from 'rxjs/operators';

@Component({
	selector: 'kt-inventory-list',
	templateUrl: './inventory-list.component.html',
	styleUrls: ['./inventory-list.component.scss']
})
export class InventoryListComponent implements OnInit {

	dataSource: InventoryListDataSource;
	displayedColumns = ['name', 'stock', 'actions'];
	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
	selection = new SelectionModel<Inventory>(true, []);

	collectionName: string = "inventory";
	deleteModalTitle: string = "Delete Item";
	putScreenPath: string = "inventory/set-inventory";

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
		this.dataSource = new InventoryListDataSource(this.firestoreService);
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

	// showDeleteConfirmation(data) {
	// 	console.log(data);
	// 	this.layoutUtilsService.deleteElement(
	// 		this.deleteModalTitle,
	// 		`Are you sure you want to delete ${data.name}?`,
	// 		`Deleting ${data.name}`,
	// 		() => this.firestoreService.deleteDocument(this.collectionName, data.id)
	// 	);
	// }

	showUpdateDialog(data) {
		this.router.navigateByUrl(`${this.putScreenPath}?id=${data.id}`);
	}

}
