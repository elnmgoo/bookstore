import {Injectable} from '@angular/core';
import {Adapter} from '../Adapter';
import {Inkoop, InkoopAdapter} from './inkoop';

export class SearchResultProcurement {
  procurement: Inkoop[];
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

  constructor(procurement: Inkoop[], empty: boolean, first: boolean, last: boolean, aNumber: number, numberOfElements: number,
              pageable, size: number, sort, totalElements: number, totalPages: number) {
    this.procurement = procurement;
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
export class SearchResultProcurementAdapter implements Adapter<SearchResultProcurement> {
  private inkoopAdapter: InkoopAdapter = new InkoopAdapter();

  adapt(item: any): SearchResultProcurement {
    let procurements = null;
    if (item.content != null) {
      procurements = item.content.map(procurement => this.inkoopAdapter.adapt(procurement));
    }
    return new SearchResultProcurement(procurements, item.empty, item.first, item.last, item.nuber, item.numberOfElements,
      item.pageable,  item.size, item.sort, item.totalElements, item.totalPages);
  }
}

