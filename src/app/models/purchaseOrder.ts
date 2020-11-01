import {Book, BookAdapter} from '../../store/book/models/book';
import {Injectable} from '@angular/core';
import {Adapter} from '../Adapter';

export class PurchaseOrder {
  id: number;
  dateTime: number;
  price: number;
  amount: number;
  amountInDepot: number;
  totalPrice: number;
  book: Book;
  isBook: boolean;
  tax: number;
  description: string;

  constructor(id: number, dateTime: number, price: number, amount: number, amountDepot: number, totalPrice: number, book: Book,
              tax: number, isBook: boolean, description: string) {
    this.id = id;
    this.dateTime = dateTime;
    this.price = (price != null) ? price : 0;
    this.amount = amount;
    this.amountInDepot = amountDepot;
    this.totalPrice = totalPrice;
    this.book = book;
    this.isBook = isBook;
    this.tax = (tax === 0) ? 21 : tax;
    if (description != null) {
      this.description = description;
    } else {
      this.description = (amount > 1) ? book.title + '(x' + amount + ')' : book.title;
    }
  }
}

@Injectable({
  providedIn: 'root',
})
export class PurchaseOrderAdapter implements Adapter<PurchaseOrder> {
  private bookAdapter: BookAdapter = new BookAdapter();

  adapt(item: any): PurchaseOrder {
    console.log('adapt book');
    let book: Book = null;
    if (item.boek != null) {
      book = this.bookAdapter.adapt(item.boek);
    }
    return new PurchaseOrder(item.orderid, item.datumtijd, item.prijs, item.aantal, item.aantalDepot, item.totaal, book, item.isBoek,
      item.btw, item.beschrijving);
  }
}
