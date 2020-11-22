import {Component, OnInit, QueryList, ViewChildren} from '@angular/core';
import {PurchaseOrdersService} from '../../services/purchase-orders.service';
import {ConfirmDialogService} from '../../modules/confirm-dialog/confirm-dialog.service';
import {BooksService} from '../../services/book.service';
import {Observable} from 'rxjs';
import {PurchaseOrder} from '../../models/purchaseOrder';
import {Book} from '../../../store/book/models/book';
import {NgbdSortableHeaderDirective, SortEvent} from '../../directives/ngbd-sortable-header.directive';
import {DecimalPipe} from '@angular/common';
import {BookDialogComponent} from '../book-dialog/book-dialog.component';
import {NgbModal, NgbModalConfig} from '@ng-bootstrap/ng-bootstrap';

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
              private confirmDialogService: ConfirmDialogService,
              private config: NgbModalConfig,
              private modalService: NgbModal) {
    config.backdrop = 'static';
    config.keyboard = true;
    config.size = 'xl';
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

  onButtonAdd() {
    const book: Book = new Book('', '', '', 0, 0, null, 0);
    const modalRef = this.modalService.open(BookDialogComponent);
    modalRef.componentInstance.book = book;
    modalRef.componentInstance.bNew = true;
    modalRef.componentInstance.service = this.service;
  }

  handleDelete(book) {
    this.modalService.open(BookDialogComponent);
  }

  handleEdit(book) {
    const modalRef = this.modalService.open(BookDialogComponent);
    modalRef.componentInstance.book = book;
    modalRef.componentInstance.bNew = false;
    modalRef.componentInstance.service = this.service;
  }

}
