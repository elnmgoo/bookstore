import {Injectable} from '@angular/core';
import {Adapter} from '../../../app/Adapter';
import {Publisher} from '../../publishers/models/publisher';

export class Book {
  isbn: string;
  title: string;
  author: string;
  supply: number;
  publisher: Publisher;
  price: number;
  onWebSite: boolean;

  constructor(isbn: string, title: string, author: string, supply: number,
              publisher: Publisher, price: number, onWebSite: boolean) {
    this.isbn = (isbn != null) ? isbn : '';
    this.title = (title != null) ? title : '';
    this.author = (author != null) ? author : '';
    this.supply = (supply != null) ? supply : 0;
    this.publisher = (publisher != null) ? publisher : new Publisher('', '');
    this.price = (price != null) ? price : 0;
    this.onWebSite = onWebSite;
  }


  public static getBoek(book: Book) {
    const boek: any = new Object();
    const uitgever: any = new Object();
    uitgever.id = book.publisher.id;
    uitgever.uitgever = book.publisher.publisher;
    boek.isbn = book.isbn;
    boek.titel = book.title;
    boek.auteur = book.author;
    boek.uitgever = uitgever;
    boek.prijs = book.price;
    boek.voorraad = book.supply;
    boek.onWebSite = book.onWebSite;
    return (boek);
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
    return new Book(item.isbn, item.titel, item.auteur, item.voorraad, publisher, item.prijs, item.onWebSite);
  }
}
