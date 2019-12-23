import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { Inventory } from '../../../../core/inventory';
import { QueryParamsModel, LayoutUtilsService } from '../../../../core/_base/crud';
import { Router } from '@angular/router';
import { FirestoreService } from '../../../../services/firestore.service';
import { merge } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LowStocksListDataSource } from './low-stocks.data-source';

@Component({
  selector: 'kt-low-stocks-list',
  templateUrl: './low-stocks-list.component.html',
  styleUrls: ['./low-stocks-list.component.scss']
})
export class LowStocksListComponent implements OnInit {

  dataSource: LowStocksListDataSource;
  displayedColumns = ['name', 'stock', 'minimumStockAllowed'];
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
    this.dataSource = new LowStocksListDataSource(this.firestoreService);
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
