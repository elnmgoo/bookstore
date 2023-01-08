import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';

import {environment} from '../../../environments/environment';
import {Book, BookAdapter} from '../models/book';
import {catchError, map} from 'rxjs/operators';

@Injectable()
export class BookService {
  booksUrl = environment.apiUrl + '/boeken';

  constructor(private httpClient: HttpClient, private adapter: BookAdapter) {
  }
/*
  getBooks(): Observable<Book[]> {
    return this.httpClient.get<Book[]>(this.booksUrl).pipe(
      map((data: any[]) => data.map((item) => this.adapter.adapt(item)))
    );
  }

  addBook(book: Book): Observable<Book> {
    return this.httpClient.put<Book>(this.booksUrl, book).pipe(
      map((item) => this.adapter.adapt(item))
    );
  }

  deleteBook(book: Book): Observable<Book> {
    return this.httpClient.delete<Book>(this.booksUrl + '/' + book.id).pipe(
      map((item) => book));
  }
*/
  getBook(isbn: string): Observable<Book> {
    return this.httpClient.get<Book>(this.booksUrl + '/' + isbn).pipe(
      map((item) => this.adapter.adapt(item)),
      catchError(this.handleError));
  }

  handleError(error: HttpErrorResponse) {
    let errorMessage;
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
}
