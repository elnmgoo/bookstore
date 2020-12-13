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
import {Book, BookAdapter} from '../../store/book/models/book';
import {SearchResultBook, SearchResultBookAdapter} from '../../store/book/models/searchResultBook';

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
export class BooksService {

  private static pState: State = {
    page: 1,
    pageSize: 10,
    searchTerm: '',
    sortColumn: 'isbn',
    sortDirection: 'desc',
  };
  private booksUrl = environment.apiUrl ;
  private pLoading$ = new BehaviorSubject<boolean>(true);
  private pSearch$ = new Subject<void>();
  private pBooks$ = new BehaviorSubject<Book[]>([]);
  private pTotal$ = new BehaviorSubject<number>(0);


  constructor(private httpClient: HttpClient,
              private adapter: SearchResultBookAdapter,
              private pipe: DecimalPipe,
              private bookAdapter: BookAdapter
  ) {
    this.pSearch$.pipe(
      tap(() => this.pLoading$.next(true)),
      debounceTime(200),
      switchMap(() => this.pSearch()),
      delay(200),
      tap(() => this.pLoading$.next(false))
    ).subscribe(result => {
      this.pBooks$.next(result.books);
      this.pTotal$.next(result.totalElements);
    });
    this.pSearch$.next();
  }


  get books$() {
    return this.pBooks$.asObservable();
  }

  get total$() {
    return this.pTotal$.asObservable();
  }
  get loading$() {
    return this.pLoading$.asObservable();
  }

  get page() {
    return BooksService.pState.page;
  }

  set page(page: number) {
    this.pSet({page});
  }

  get pageSize() {
    return BooksService.pState.pageSize;
  }

  set pageSize(pageSize: number) {
    this.pSet({pageSize});
  }

  get searchTerm() {
    return BooksService.pState.searchTerm;
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
    Object.assign(BooksService.pState, patch);
    this.pSearch$.next();
  }

  private pSearch(): Observable<SearchResultBook> {
    const {sortColumn, sortDirection, pageSize, page, searchTerm} = BooksService.pState;
    const mapSortColumn = new Map();
    mapSortColumn.set('title', 'titel');
    mapSortColumn.set('publisher', 'uitgever.naam');
    mapSortColumn.set('price', 'prijs');
    mapSortColumn.set('isbn', 'isbn');
    mapSortColumn.set('author', 'auteur');
    mapSortColumn.set('depot', 'depot');
    console.log('sortColumn ' + sortColumn + ', ' + mapSortColumn.get(sortColumn));
    console.log('sortOrder ' + sortDirection);
    console.log('searchTerm ' + searchTerm);
    // orders: [...state.orders, action.payload]

    let urlSuffix = '?page=' + (page - 1) + '&size=' + pageSize;
    if (sortColumn) {
      urlSuffix += '&sort=' + mapSortColumn.get(sortColumn) + ',' + sortDirection;
    }

    const url = this.booksUrl + '/boeken';
    let theUrl = url + urlSuffix;
    if (searchTerm.length > 0) {
      theUrl = url + '/search/' + searchTerm + urlSuffix;
    }
    return this.httpClient.get<SearchResultPurchaseOrder>(theUrl).pipe(
      map((item) => this.adapter.adapt(item)),
      catchError(this.handleError));
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

  getBook(isbn: string): Observable<Book> {
    return this.httpClient.get<Book>(this.booksUrl + '/boeken/' + isbn).pipe(
      map((item) => this.bookAdapter.adapt(item)),
      catchError(this.handleError));
  }

  delete(isbn: number) {
    console.log('remove ' + isbn);
    this.httpClient.delete(this.booksUrl + '/boeken/' + isbn).pipe(
      map(response => {
        console.log(response);
        this.pSearch$.next();
      }),
      catchError(this.handleError)).subscribe();
  }

  public update(book: Book){
    const boek = Book.getBoek(book);
    const url = this.booksUrl + '/uitgevers/' + boek.uitgever.id + '/boeken/' + boek.isbn;
    return this.httpClient.put(url, boek).pipe(
      tap(() => this.pSearch$.next())
      );
  }

  public getNrOfOrders(book: Book){
    return this.httpClient.get<number>(this.booksUrl + '/boeken/' + book.isbn + '/nroforders');
  }

}
