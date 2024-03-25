import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, Subject, throwError} from 'rxjs';
import {SortDirection} from '../directives/ngbd-sortable-header.directive';
import {catchError, debounceTime, delay, map, switchMap, tap} from 'rxjs/operators';
import {environment} from '../../environments/environment';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {SearchResultPurchaseOrder} from '../models/searchResultPurchaseOrder';
import {DecimalPipe} from '@angular/common';
import {Book, BookAdapter} from '../../store/book/models/book';
import {SearchResultBook, SearchResultBookAdapter} from '../../store/book/models/searchResultBook';
import {BookStatistics} from '../models/bookStatistics';

interface State {
  page: number;
  pageSize: number;
  searchTerm: string;
  sortColumn: string;
  sortDirection: SortDirection;
  onlyWebSite: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class BooksService {

  private static pState: State = {
    page: 1,
    pageSize: 8,
    searchTerm: '',
    sortColumn: 'isbn',
    sortDirection: 'desc',
    onlyWebSite: false
  };
  private booksUrl = environment.apiUrl;
  private pLoading$ = new BehaviorSubject<boolean>(true);
  private pSearch$ = new Subject<void>();
  private pBooks$ = new BehaviorSubject<Book[]>([]);
  private pTotal$ = new BehaviorSubject<number>(0);
  private pSearchBookStatistics$ = new Subject<void>();
  private pBookStatistics$ = new BehaviorSubject<BookStatistics>(new BookStatistics());


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

    this.pSearchBookStatistics$.pipe(
      switchMap(() => this.pSearchBookStatistics())
    ).subscribe(result => {
      this.pBookStatistics$.next(result);
    });
    this.pSearchBookStatistics$.next();
  }

  refresh() {
    this.pSearch$.next();
    this.pSearchBookStatistics$.next();
  }


  get books$() {
    return this.pBooks$.asObservable();
  }

  get bookStatistics$() {
    return this.pBookStatistics$.asObservable();
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
    return BooksService.pState.searchTerm.trim();
  }

  set searchTerm(searchTerm: string) {
    this.pSet({searchTerm});
  }

  get onlyWebSite() {
    return BooksService.pState.onlyWebSite;
  }

  set onlyWebSite(onlyWebSite: boolean) {
    this.pSet({onlyWebSite});
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
    this.pSearchBookStatistics$.next();
  }

  private pSearch(): Observable<SearchResultBook> {
    const {sortColumn, sortDirection, pageSize, page, searchTerm, onlyWebSite} = BooksService.pState;
    const mapSortColumn = new Map();
    mapSortColumn.set('title', 'titel');
    mapSortColumn.set('publisher', 'uitgever.naam');
    mapSortColumn.set('price', 'prijs');
    mapSortColumn.set('isbn', 'isbn');
    mapSortColumn.set('author', 'auteur');
    mapSortColumn.set('supply', 'voorraad');
    let urlSuffix = '?page=' + (page - 1) + '&size=' + pageSize;
    if (sortColumn) {
      urlSuffix += '&sort=' + mapSortColumn.get(sortColumn) + ',' + sortDirection;
    }
    if (onlyWebSite){
      urlSuffix += '&onlyWebSite=true';
    }
    const url = this.booksUrl + '/boeken';
    let theUrl = url + urlSuffix;
    const searchString = searchTerm.trim();
    if (searchString.length > 0) {
      theUrl = url + '/search/' + searchString + urlSuffix;
    }
    return this.httpClient.get<SearchResultPurchaseOrder>(theUrl).pipe(
      map((item) => this.adapter.adapt(item)),
      catchError(this.handleError));
  }

  handleError(error: HttpErrorResponse) {
    const clientError = error.error instanceof ErrorEvent;
    const errorMessage = clientError ? `Error: ${error.error.message}` : `Error Code: ${error.status}\nMessage: ${error.message}`;
    this.displayError(errorMessage);
    return throwError(errorMessage);
  }

  private displayError(message: string) {
    window.alert(message);
  }

  getBook(isbn: string): Observable<Book> {
    return this.httpClient.get<Book>(this.booksUrl + '/boeken/' + isbn).pipe(
      map((item) => this.bookAdapter.adapt(item)),
      catchError(this.handleError));
  }

  pSearchBookStatistics(): Observable<BookStatistics> {
    const {searchTerm, onlyWebSite} = BooksService.pState;
    if (onlyWebSite){
      return this.httpClient.get<BookStatistics>(this.booksUrl + '/statistics/boeken/' + searchTerm + '?onlyWebSite=true&');
    }
    return this.httpClient.get<BookStatistics>(this.booksUrl + '/statistics/boeken/' + searchTerm);
  }

  delete(isbn: number) {
    this.httpClient.delete(this.booksUrl + '/boeken/' + isbn).pipe(
      map(response => {
        this.pSearch$.next();
        this.pSearchBookStatistics$.next();
      }),
      catchError(this.handleError)).subscribe();
  }

  public update(book: Book) {
    const boek = Book.getBoek(book);
    const url = this.booksUrl + '/uitgevers/' + boek.uitgever.id + '/boeken/' + boek.isbn;
    return this.httpClient.put(url, boek).pipe(
      tap(() => {
        this.pSearch$.next();
        this.pSearchBookStatistics$.next();
      })
    );
  }

  public getNrOfOrders(book: Book) {
    return this.httpClient.get<number>(this.booksUrl + '/boeken/' + book.isbn + '/nroforders');
  }

}
