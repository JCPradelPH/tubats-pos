import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { MenuCategory } from '../../../../core/menu-category';
import { QueryParamsModel, LayoutUtilsService } from '../../../../core/_base/crud';
import { Router } from '@angular/router';
import { FirestoreService } from '../../../../services/firestore.service';
import { merge } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PosTransactionsListDataSource } from './pos-transactions.data-source';

@Component({
  selector: 'kt-pos-transactions-list',
  templateUrl: './pos-transactions-list.component.html',
  styleUrls: ['./pos-transactions-list.component.scss']
})
export class PosTransactionsListComponent implements OnInit {

  dataSource: PosTransactionsListDataSource;
  displayedColumns = ['tableNumber', 'total', 'amountTendered', 'change', 'readableTransactionDate', 'actions'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  selection = new SelectionModel<MenuCategory>(true, []);

  collectionName: string = "orders";
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
    this.dataSource = new PosTransactionsListDataSource(this.firestoreService);
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
