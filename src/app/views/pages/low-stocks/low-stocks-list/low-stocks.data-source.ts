import { Inventory } from '../../../../core/inventory';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { QueryParamsModel, QueryResultsModel, HttpExtenstionsModel } from '../../../../core/_base/crud';
import { FirestoreService } from '../../../../services/firestore.service';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';

export class LowStocksListDataSource implements DataSource<Inventory> {
    // Public properties
    entitySubject = new BehaviorSubject<any[]>([]);
    hasItems: boolean = false; // Need to show message: 'No records found

    // Loading | Progress bar
    loadingSubject = new BehaviorSubject<boolean>(false);
    loading$: Observable<boolean>;

    // Paginator | Paginators count
    paginatorTotalSubject = new BehaviorSubject<number>(0);
    paginatorTotal$: Observable<number>;

    collectionName: string = "inventory";

	/**
	 * Data-Source Constructor
	 *
	 * @param triggerService: TriggerService
	 */
    constructor(private firestoreService: FirestoreService) {
        this.loading$ = this.loadingSubject.asObservable();
        this.paginatorTotal$ = this.paginatorTotalSubject.asObservable();
        this.paginatorTotal$.subscribe(res => this.hasItems = res > 0);
    }

	/**
	 * Connect data-source
	 *
	 * @param collectionViewer: CollectionViewer
	 */
    connect(collectionViewer: CollectionViewer): Observable<any[]> {
        // Connecting data source
        return this.entitySubject.asObservable();
    }

	/**
	 * Disconnect data-source
	 *
	 * @param collectionViewer: CollectionViewer
	 */
    disconnect(collectionViewer: CollectionViewer): void {
        // Disonnecting data source
        this.entitySubject.complete();
        this.loadingSubject.complete();
        this.paginatorTotalSubject.complete();
    }

    baseFilter(_entities: any[], _queryParams: QueryParamsModel): QueryResultsModel {
        let entitiesResult = _entities;

        // Sorting
        // start
        if (_queryParams.sortField) {
            entitiesResult = this.sortArray(_entities, _queryParams.sortField, _queryParams.sortOrder);
        }
        // end

        // Paginator
        // start
        const totalCount = entitiesResult.length;
        const initialPos = _queryParams.pageNumber * _queryParams.pageSize;
        entitiesResult = entitiesResult.slice(initialPos, initialPos + _queryParams.pageSize);
        // end

        const queryResults = new QueryResultsModel();
        queryResults.items = entitiesResult;
        queryResults.totalCount = totalCount;
        return queryResults;
    }

    async loadItems(queryParams: QueryParamsModel) {
        this.loadingSubject.next(true);
        
        const res: firebase.firestore.DocumentData[] = await this.firestoreService
            .getDocumentsOp( this.collectionName, "isLowOnStock", "==", true );
        const result = this.baseFilter(res, queryParams);
        this.entitySubject.next(result.items);
        this.paginatorTotalSubject.next(result.totalCount);
    }

    sortArray(_incomingArray: any[], _sortField: string = '', _sortOrder: string = 'asc'): any[] {
        const httpExtenstion = new HttpExtenstionsModel();
        return httpExtenstion.sortArray(_incomingArray, _sortField, _sortOrder);
    }
}