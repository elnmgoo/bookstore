import {Injectable} from '@angular/core';
import {Adapter} from '../../../app/Adapter';
import {Publisher} from '../../publishers/models/publisher';

export class Book {
  isbn: string;
  title: string;
  author: string;
  supply: number;
  supplyDepot: number;
  publisher: Publisher;
  price: number;

  constructor(isbn: string, title: string, author: string, supply: number, supplyDepot: number, publisher: Publisher, price: number) {
    this.isbn = (isbn != null) ? isbn : '';
    this.title = (title != null) ? title : '';
    this.author = (author != null) ? author : '';
    this.supply = (supply != null) ? supply : 0;
    this.supplyDepot = (supplyDepot != null) ? supplyDepot : 0;
    this.publisher = (publisher != null) ? publisher : new Publisher('', '');
    this.price = (price != null) ? price : 0;
  }
}

@Injectable({
  providedIn: 'root',
})
export class BookAdapter implements Adapter<Book> {

  adapt(item: any): Book {
    let publisher = null;
    if (item.uitgever != null) {
      publisher = new Publisher(item.uitgever.uitgeverid, item.uitgever.naam);
    }
    return new Book(item.isbn, item.titel, item.auteur, item.voorraad, item.voorraadDepot, publisher, item.prijs);
  }
}
