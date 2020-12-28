import {Book, BookAdapter} from '../../store/book/models/book';
import {Injectable} from '@angular/core';
import {Adapter} from '../Adapter';

export class Procurement {
  id: number;
  dateTime: number;
  price: number;
  amount: number;
  amountInDepot: number;
  book: Book;

  constructor(id: number, dateTime: number, price: number, amount: number, amountDepot: number, book: Book) {
    this.id = id;
    this.dateTime = dateTime;
    this.price = (price != null) ? price : 0;
    this.amount = amount;
    this.amountInDepot = amountDepot;
    this.book = book;
  }

  public  getInkoop(){
      const inkoop: any = new Object();
      const boek: any = new Object();
      const uitgever: any = new Object();
      uitgever.id = this.book.publisher.id;
      uitgever.uitgever = this.book.publisher.publisher;
      boek.isbn = this.book.isbn;
      boek.titel = this.book.title;
      boek.auteur = this.book.author;
      boek.uitgever = uitgever;
      boek.prijs = this.book.price;
      boek.voorraad = this.book.supply;
      boek.voorraadDepot = this.book.supplyDepot;
      inkoop.boek = boek;
      inkoop.datumtijd = this.dateTime;
      inkoop.prijs = this.price;
      inkoop.aantal = this.amount;
      inkoop.aantalDepot = this.amountInDepot;
      inkoop.id = 0;
      return (inkoop);
  }
}

@Injectable({
  providedIn: 'root',
})
export class ProcurementAdapter implements Adapter<Procurement> {
  private bookAdapter: BookAdapter = new BookAdapter();

  adapt(item: any): Procurement {
    console.log('adapt book');
    let book: Book = null;
    if (item.boek != null) {
      book = this.bookAdapter.adapt(item.boek);
    }
    return new Procurement(item.id, item.datumtijd, item.prijs, item.aantal, item.aantalDepot, book);
  }
}
