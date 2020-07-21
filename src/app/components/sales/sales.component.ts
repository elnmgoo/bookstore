import { Component, OnInit } from '@angular/core';
import Order from '../../../store/orders/models/order';

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.scss']
})
export class SalesComponent implements OnInit {
  public orders: Order[] = [
    { id: 1, isbn: '1234567890123', item: 'Boer Boris', price: 1200 },
    { id: 2, isbn: '', item: 'Kerstkaart', price: 200 },
    { id: 3, isbn: '1234567890124', item: 'De Hobbit', price: 2500 },
    { id: 4, isbn: '', item: 'potlood', price: 1200 }
  ];
  constructor() { }

  ngOnInit(): void {
  }

}
