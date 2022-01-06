import {Injectable} from '@angular/core';
import {Book, BookAdapter} from './book';
import {Adapter} from '../../../app/Adapter';

export class SearchResultBook {
  books: Book[];
  empty: boolean;
  first: boolean;
  last: boolean;
  number: number;
  numberOfElements: number;
  pageable;
  size: number;
  sort;
  totalElements: number;
  totalPages: number;

  constructor(books: Book[], empty: boolean, first: boolean, last: boolean, aNumber: number, numberOfElements: number,
              pageable, size: number, sort, totalElements: number, totalPages: number) {
    this.books = books;
    this.empty = empty;
    this.first = first;
    this.last = last;
    this.number = aNumber;
    this.numberOfElements = numberOfElements;
    this.pageable = pageable;
    this.size = size;
    this.sort = sort;
    this.totalElements = totalElements;
    this.totalPages = totalPages;
  }
}

@Injectable({
  providedIn: 'root',
})
export class SearchResultBookAdapter implements Adapter<SearchResultBook> {
  private bookAdapter: BookAdapter = new BookAdapter();

  adapt(item: any): SearchResultBook {
    let books = null;
    if (item.content != null) {
      books = item.content.map(book => this.bookAdapter.adapt(book));
    }
    return new SearchResultBook(books, item.empty, item.first, item.last, item.nuber, item.numberOfElements,
      item.pageable,  item.size, item.sort, item.totalElements, item.totalPages);
  }
}

