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
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

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
    this.dataSource = new PosTransactionsListDataSource(this.firestoreService);
  }

  search() {
    this.dataSource = new PosTransactionsListDataSource(this.firestoreService);
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

  showViewPage(data) {
    this.router.navigateByUrl(`pos-transactions/pos-transactions-detail?id=${data.id}`);
  }

}
