import {Component, OnInit, QueryList, ViewChildren} from '@angular/core';
import {PurchaseOrdersService} from '../../services/purchase-orders.service';
import {ConfirmDialogService} from '../../modules/confirm-dialog/confirm-dialog.service';
import {BooksService} from '../../services/book.service';
import {Observable} from 'rxjs';
import {PurchaseOrder} from '../../models/purchaseOrder';
import {Book} from '../../../store/book/models/book';
import {NgbdSortableHeaderDirective, SortEvent} from '../../directives/ngbd-sortable-header.directive';
import {DecimalPipe} from '@angular/common';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.scss'],
  providers: [BooksService, DecimalPipe]
})
export class BooksComponent implements OnInit {
  books$: Observable<Book[]>;
  total$: Observable<number>;
  @ViewChildren(NgbdSortableHeaderDirective) headers: QueryList<NgbdSortableHeaderDirective>;

  constructor(public service: BooksService,
              private confirmDialogService: ConfirmDialogService) {
  }

  ngOnInit(): void {
    this.books$ = this.service.books$;
    this.total$ = this.service.total$;
  }

  onSort({column, direction}: SortEvent) {
    // resetting other headers
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });
    this.service.sortColumn = column;
    this.service.sortDirection = direction;
  }

  onButtonAdd(){

  }

  handleDelete(book) {
  }
  handleEdit(book){

  }

}
