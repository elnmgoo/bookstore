import { Injectable } from '@angular/core';
import {NgbCalendar, NgbDate, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import {environment} from '../../environments/environment';
import {BehaviorSubject, Observable, Subject, throwError} from 'rxjs';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {DecimalPipe} from '@angular/common';
import {catchError, debounceTime, delay, map, switchMap, tap} from 'rxjs/operators';
import {SortDirection} from '../directives/ngbd-sortable-header.directive';
import {SearchResultProcurement, SearchResultProcurementAdapter} from '../models/searchResultProcurement';
import {Inkoop} from '../models/inkoop';

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
export class InkoopService {

  private static pState: State = {
    page: 1,
    pageSize: 50,
    searchTerm: '',
    sortColumn: 'datetime',
    sortDirection: 'desc',
    startFromDate: null,
    endUntilDate: null
  };
  private ordersUrl = environment.api2Url + '/inkopen';
  private procurementUrl = environment.api2Url + '/boeken/';
  private ordersTotalUrl = environment.api2Url + '/inkopenTotal';
  private pLoading$ = new BehaviorSubject<boolean>(true);
  private pSearch$ = new Subject<void>();
  private pProcurement$ = new BehaviorSubject<Inkoop[]>([]);
  private pTotal$ = new BehaviorSubject<number>(0);
  private pSearchTotal$ = new Subject<void>();
  private pSearchPriceTotal$ = new BehaviorSubject<number>(0);


  constructor(private httpClient: HttpClient, private adapter: SearchResultProcurementAdapter,
              private pipe: DecimalPipe,
              private calendar: NgbCalendar) {
    if (InkoopService.pState.endUntilDate === null) {
      InkoopService.pState.endUntilDate = calendar.getToday();
    }
    if (InkoopService.pState.startFromDate === null) {
      InkoopService.pState.startFromDate = calendar.getToday();
    }
    this.pSearch$.pipe(
      tap(() => this.pLoading$.next(true)),
      debounceTime(200),
      switchMap(() => this.pSearch()),
      delay(200),
      tap(() => this.pLoading$.next(false))
    ).subscribe(result => {
      this.pProcurement$.next(result.procurement);
      this.pTotal$.next(result.totalElements);
    });
    this.pSearch$.next();

    this.pSearchTotal$.pipe(
      switchMap(() => this.pSearchTotal())
    ).subscribe(result => {
      this.pSearchPriceTotal$.next(result);
    });
    this.pSearchTotal$.next();
  }

  get searchPriceTotal$() {
    return this.pSearchPriceTotal$.asObservable();
  }

  get procurement$() {
    return this.pProcurement$.asObservable();
  }

  get total$() {
    return this.pTotal$.asObservable();
  }

  get loading$() {
    return this.pLoading$.asObservable();
  }

  get page() {
    return InkoopService.pState.page;
  }

  set page(page: number) {
    this.pSet({page});
  }

  get pageSize() {
    return InkoopService.pState.pageSize;
  }

  set pageSize(pageSize: number) {
    this.pSet({pageSize});
  }

  get searchTerm() {
    return InkoopService.pState.searchTerm;
  }

  set searchTerm(searchTerm: string) {
    this.pSet({searchTerm});
  }

  get startFromDate() {
    return InkoopService.pState.startFromDate;
  }

  set startFromDate(startFromDate: NgbDateStruct) {
    this.pSet({startFromDate});
  }

  get endUntilDate() {
    return InkoopService.pState.endUntilDate;
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
    Object.assign(InkoopService.pState, patch);
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

  private pSearch(): Observable<SearchResultProcurement> {
    const {sortColumn, sortDirection, pageSize, page, searchTerm, startFromDate, endUntilDate} = InkoopService.pState;
    const mapSortColumn = new Map();
    mapSortColumn.set('title', 'titel');
    mapSortColumn.set('datetime', 'datumtijd');
    mapSortColumn.set('book.publisher', 'boek.uitgever.naam');
    mapSortColumn.set('book.title', 'boek.titel');
    mapSortColumn.set('price', 'prijs');
    mapSortColumn.set('isbn', 'boek.isbn');
    mapSortColumn.set('author', 'boek.auteur');
    mapSortColumn.set('amount', 'aantal');
    let urlSuffix = '?page=' + (page - 1) + '&size=' + pageSize;
    if (sortColumn) {
      urlSuffix += '&sort=' + mapSortColumn.get(sortColumn) + ',' + sortDirection;
    }
    const url = this.ordersUrl + this.formatBetweenPartUrl(startFromDate, endUntilDate);
    if (searchTerm.length > 0) {
      return this.httpClient.get<SearchResultProcurement>(url + '/search/' + searchTerm + urlSuffix).pipe(
        map((item) => this.adapter.adapt(item)),
        catchError(this.handleError));
    } else {
      return this.httpClient.get<SearchResultProcurement>(url + urlSuffix).pipe(
        map((item) => this.adapter.adapt(item)),
        catchError(this.handleError));
    }
  }

  private pSearchTotal(): Observable<number> {
    const {searchTerm, startFromDate, endUntilDate} = InkoopService.pState;

    const url = this.ordersTotalUrl + this.formatBetweenPartUrl(startFromDate, endUntilDate);
    if (searchTerm.length > 0) {
      return this.httpClient.get<number>(url + '/search/' + searchTerm);
    } else {
      return this.httpClient.get<number>(url);
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
    this.httpClient.delete(this.ordersUrl + '/' + purchasOrderId).pipe(
      map(response => {
        this.pSearch$.next();
        this.pSearchTotal$.next();
      }),
      catchError(this.handleError)).subscribe();
  }

  add(procurement: Inkoop) {
    const inkoop = procurement.getInkoop();
    return this.httpClient.post(this.procurementUrl + procurement.book.isbn + '/inkopen', inkoop ).pipe(
      map(response => {
        this.pSearch$.next();
        this.pSearchTotal$.next();
      }),
      catchError(this.handleError));
  }
}
