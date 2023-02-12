import {Book, BookAdapter} from '../../store/book/models/book';
import {Injectable} from '@angular/core';
import {Adapter} from '../Adapter';

export class Inkoop {
  id: number;
  dateTime: number;
  price: number;
  amount: number;
  book: Book;

  constructor(id: number, dateTime: number, price: number, amount: number, book: Book) {
    this.id = id;
    this.dateTime = dateTime;
    this.price = (price != null) ? price : 0;
    this.amount = amount;
    this.book = book;
  }

  public  getInkoop(){
      const inkoop: any = new Object();
      const boek: any = new Object();
      const uitgever: any = new Object();
      uitgever.uitgeverid = this.book.publisher.id;
      uitgever.naam = this.book.publisher.publisher;
      boek.isbn = this.book.isbn;
      boek.titel = this.book.title;
      boek.auteur = this.book.author;
      boek.uitgever = uitgever;
      boek.prijs = this.book.price;
      boek.voorraad = this.book.supply;
      inkoop.boek = boek;
      inkoop.datumtijd = this.dateTime;
      inkoop.prijs = this.price;
      inkoop.aantal = this.amount;
      inkoop.id = -1;
      return (inkoop);
  }
}

@Injectable({
  providedIn: 'root',
})
export class InkoopAdapter implements Adapter<Inkoop> {
  private bookAdapter: BookAdapter = new BookAdapter();

  adapt(item: any): Inkoop {
    let book: Book = null;

    if (item.boek != null) {
      book = this.bookAdapter.adapt(item.boek);
    }
    return new Inkoop(item.id, item.datumtijd, item.prijs, item.aantal, book);
  }
}
