import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { MenuCategory } from '../../../../core/menu-category';
import { QueryParamsModel, LayoutUtilsService } from '../../../../core/_base/crud';
import { Router } from '@angular/router';
import { FirestoreService } from '../../../../services/firestore.service';
import { merge } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MenuCategoryListDataSource } from './menu-category.data-source';

@Component({
	selector: 'kt-menu-category-list',
	templateUrl: './menu-category-list.component.html',
	styleUrls: ['./menu-category-list.component.scss']
})
export class MenuCategoryListComponent implements OnInit {

	dataSource: MenuCategoryListDataSource;
	displayedColumns = ['name', 'actions'];
	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
	selection = new SelectionModel<MenuCategory>(true, []);

	collectionName: string = "menu_categories";
	putScreenPath: string = "menu-category/set-menu-category";

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
		this.dataSource = new MenuCategoryListDataSource(this.firestoreService);
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
