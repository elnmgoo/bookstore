import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, Subject, throwError} from 'rxjs';
import {PurchaseOrder} from '../models/purchaseOrder';
import {SortDirection} from '../directives/ngbd-sortable-header.directive';
import {catchError, debounceTime, delay, map, switchMap, tap} from 'rxjs/operators';
import {environment} from '../../environments/environment';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {SearchResultPurchaseOrder, SearchResultPurchaseOrderAdapter} from '../models/searchResultPurchaseOrder';
import {DecimalPipe} from '@angular/common';

interface State {
  page: number;
  pageSize: number;
  searchTerm: string;
  sortColumn: string;
  sortDirection: SortDirection;
}

@Injectable({
  providedIn: 'root'
})
export class PurchaseOrdersService {
  private ordersUrl = environment.apiUrl + '/orders';
  private pLoading$ = new BehaviorSubject<boolean>(true);
  private pSearch$ = new Subject<void>();
  private pPurchaseOrders$ = new BehaviorSubject<PurchaseOrder[]>([]);
  private pTotal$ = new BehaviorSubject<number>(0);

  private pState: State = {
    page: 1,
    pageSize: 10,
    searchTerm: '',
    sortColumn: '',
    sortDirection: ''
  };

  constructor(private httpClient: HttpClient, private adapter: SearchResultPurchaseOrderAdapter,
              private pipe: DecimalPipe) {
    this.pSearch$.pipe(
      tap(() => this.pLoading$.next(true)),
      debounceTime(200),
      switchMap(() => this.pSearch()),
      delay(200),
      tap(() => this.pLoading$.next(false))
    ).subscribe(result => {
      this.pPurchaseOrders$.next(result.purchaseOrders);
      this.pTotal$.next(result.totalElements);
    });

    this.pSearch$.next();
  }

  get purchaseOrders$() {
    return this.pPurchaseOrders$.asObservable();
  }

  get total$() {
    return this.pTotal$.asObservable();
  }

  get loading$() {
    return this.pLoading$.asObservable();
  }

  get page() {
    return this.pState.page;
  }

  set page(page: number) {
    this.pSet({page});
  }

  get pageSize() {
    return this.pState.pageSize;
  }

  set pageSize(pageSize: number) {
    this.pSet({pageSize});
  }

  get searchTerm() {
    return this.pState.searchTerm;
  }

  set searchTerm(searchTerm: string) {
    this.pSet({searchTerm});
  }

  set sortColumn(sortColumn: string) {
    this.pSet({sortColumn});
  }

  set sortDirection(sortDirection: SortDirection) {
    this.pSet({sortDirection});
  }

  private pSet(patch: Partial<State>) {
    Object.assign(this.pState, patch);
    this.pSearch$.next();
  }

  private pSearch(): Observable<SearchResultPurchaseOrder> {
    const {sortColumn, sortDirection, pageSize, page, searchTerm} = this.pState;
    const mapSortColumn = new Map();
    mapSortColumn.set('description', 'beschrijving');
    mapSortColumn.set('datetime', 'datumtijd');
    mapSortColumn.set('book.uitgever', 'boek.uitgever.naam');
    mapSortColumn.set('totalPrice', 'totaal');
    mapSortColumn.set('price', 'prijs');
    mapSortColumn.set('isbn', 'boek.isbn');
    mapSortColumn.set('author', 'boek.auteur');
    mapSortColumn.set('amount', 'aantal');
    console.log('sortColumn ' + sortColumn + ', ' + mapSortColumn.get(sortColumn));
    console.log('sortOrder ' + sortDirection);
    console.log('searchTerm ' + searchTerm);
    // orders: [...state.orders, action.payload]

    let urlSuffix = '?page=' + (page - 1) + '&size=' + pageSize;
    if (sortColumn) {
      urlSuffix += '&sort=' + mapSortColumn.get(sortColumn) + ',' + sortDirection;
    }
    if (searchTerm.length > 0) {
      return this.httpClient.get<SearchResultPurchaseOrder>(this.ordersUrl + '/search/' + searchTerm + urlSuffix).pipe(
        map((item) => this.adapter.adapt(item)),
        catchError(this.handleError));
    } else {
      return this.httpClient.get<SearchResultPurchaseOrder>(this.ordersUrl + urlSuffix).pipe(
        map((item) => this.adapter.adapt(item)),
        catchError(this.handleError));

    }
  }

  handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error!';
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side errors
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    window.alert(errorMessage);
    return throwError(errorMessage);
  }

  delete(purchasOrderId: number) {
    console.log('remove ' + purchasOrderId);
    this.httpClient.delete(this.ordersUrl + '/' + purchasOrderId).pipe(
      map(response => {
        console.log(response);
        this.pSearch$.next();
      }),
      catchError(this.handleError)).subscribe();
  }


}
