import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, Subject, throwError} from 'rxjs';
import {PurchaseOrder} from '../models/purchaseOrder';
import {SortDirection} from '../directives/ngbd-sortable-header.directive';
import {catchError, debounceTime, delay, map, switchMap, tap} from 'rxjs/operators';
import {environment} from '../../environments/environment';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {SearchResultPurchaseOrder, SearchResultPurchaseOrderAdapter} from '../models/searchResultPurchaseOrder';
import {DecimalPipe} from '@angular/common';
import {NgbCalendar, NgbDate, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import {BtwTotal} from '../models/btwTotal';

interface State {
  page: number;
  pageSize: number;
  searchTerm: string;
  sortColumn: string;
  sortDirection: SortDirection;
  startFromDate: NgbDateStruct;
  endUntilDate: NgbDateStruct;
}

@Injectable({
  providedIn: 'root'
})
export class PurchaseOrdersService {

  private static pState: State = {
    page: 1,
    pageSize: 8,
    searchTerm: '',
    sortColumn: 'datetime',
    sortDirection: 'desc',
    startFromDate: null,
    endUntilDate: null
  };
  private ordersUrl = environment.apiUrl + '/orders';
  private ordersTotalUrl = environment.apiUrl + '/ordersTotal';
  private pLoading$ = new BehaviorSubject<boolean>(true);
  private pSearch$ = new Subject<void>();
  private pPurchaseOrders$ = new BehaviorSubject<PurchaseOrder[]>([]);
  private pTotal$ = new BehaviorSubject<number>(0);
  private pSearchTotal$ = new Subject<void>();
  private pSearchBtwTotal$ = new BehaviorSubject<BtwTotal[]>([]);


  constructor(private httpClient: HttpClient, private adapter: SearchResultPurchaseOrderAdapter,
              private pipe: DecimalPipe,
              private calendar: NgbCalendar) {
    if (PurchaseOrdersService.pState.endUntilDate === null) {
      PurchaseOrdersService.pState.endUntilDate = calendar.getToday();
    }
    if (PurchaseOrdersService.pState.startFromDate === null) {
      PurchaseOrdersService.pState.startFromDate = calendar.getToday();
    }
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

    this.pSearchTotal$.pipe(
      switchMap(() => this.pSearchTotal())
    ).subscribe(result => {
      this.pSearchBtwTotal$.next(result);
    });
    this.pSearchTotal$.next();
  }

  get searchBtwTotal$() {
    return this.pSearchBtwTotal$.asObservable();
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
    return PurchaseOrdersService.pState.page;
  }

  set page(page: number) {
    this.pSet({page});
  }

  get pageSize() {
    return PurchaseOrdersService.pState.pageSize;
  }

  set pageSize(pageSize: number) {
    this.pSet({pageSize});
  }

  get searchTerm() {
    return PurchaseOrdersService.pState.searchTerm;
  }

  set searchTerm(searchTerm: string) {
    this.pSet({searchTerm});
  }

  get startFromDate() {
    return PurchaseOrdersService.pState.startFromDate;
  }

  set startFromDate(startFromDate: NgbDateStruct) {
    this.pSet({startFromDate});
  }

  get endUntilDate() {
    return PurchaseOrdersService.pState.endUntilDate;
  }

  set endUntilDate(endUntilDate: NgbDateStruct) {
    this.pSet({endUntilDate});
  }

  set sortColumn(sortColumn: string) {
    this.pSet({sortColumn});
  }

  set sortDirection(sortDirection: SortDirection) {
    this.pSet({sortDirection});
  }

  private pSet(patch: Partial<State>) {
    Object.assign(PurchaseOrdersService.pState, patch);
    this.pSearch$.next();
    this.pSearchTotal$.next();
  }

  private formatBetweenPartUrl(startFromDate, endUntilDate){
    let fromTime = new Date(this.calendar.getToday().year, this.calendar.getToday().month - 1, this.calendar.getToday().day).getTime();
    if (startFromDate.day != null ){
      fromTime = new Date(startFromDate.year, startFromDate.month - 1, startFromDate.day).getTime();
    }
    let untilTime = new Date(this.calendar.getToday().year, this.calendar.getToday().month, this.calendar.getToday().day).getTime();
    if (endUntilDate.day != null ){
      untilTime = new Date(endUntilDate.year, endUntilDate.month - 1, endUntilDate.day).getTime();
    }
    untilTime += (24 * 60 * 60 * 1000 - 1);
    return '/between/' + fromTime.toString() + '/' + untilTime.toString();
  }


  private pSearch(): Observable<SearchResultPurchaseOrder> {
    const {sortColumn, sortDirection, pageSize, page, searchTerm, startFromDate, endUntilDate} = PurchaseOrdersService.pState;
    const mapSortColumn = new Map();
    mapSortColumn.set('description', 'beschrijving');
    mapSortColumn.set('datetime', 'datumtijd');
    mapSortColumn.set('book.uitgever', 'boek.uitgever.naam');
    mapSortColumn.set('totalPrice', 'totaal');
    mapSortColumn.set('price', 'prijs');
    mapSortColumn.set('isbn', 'boek.isbn');
    mapSortColumn.set('author', 'boek.auteur');
    mapSortColumn.set('amount', 'aantal');
    mapSortColumn.set('amountInDepot', 'aantalDepot');
    console.log('sortColumn ' + sortColumn + ', ' + mapSortColumn.get(sortColumn));
    console.log('sortOrder ' + sortDirection);
    console.log('searchTerm ' + searchTerm);
    // orders: [...state.orders, action.payload]

    let urlSuffix = '?page=' + (page - 1) + '&size=' + pageSize;
    if (sortColumn) {
      urlSuffix += '&sort=' + mapSortColumn.get(sortColumn) + ',' + sortDirection;
    }
    const url = this.ordersUrl + this.formatBetweenPartUrl(startFromDate, endUntilDate);
    if (searchTerm.length > 0) {
      return this.httpClient.get<SearchResultPurchaseOrder>(url + '/search/' + searchTerm + urlSuffix).pipe(
        map((item) => this.adapter.adapt(item)),
        catchError(this.handleError));
    } else {
      return this.httpClient.get<SearchResultPurchaseOrder>(url + urlSuffix).pipe(
        map((item) => this.adapter.adapt(item)),
        catchError(this.handleError));
    }
  }

  private pSearchTotal(): Observable<BtwTotal[]> {
    const {searchTerm, startFromDate, endUntilDate} = PurchaseOrdersService.pState;
    const url = this.ordersTotalUrl + this.formatBetweenPartUrl(startFromDate, endUntilDate);
    if (searchTerm.length > 0) {
      return this.httpClient.get<BtwTotal[]>(url + '/search/' + searchTerm);
    } else {
      return this.httpClient.get<BtwTotal[]>(url);
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
        this.pSearchTotal$.next();
      }),
      catchError(this.handleError)).subscribe();
  }
}
