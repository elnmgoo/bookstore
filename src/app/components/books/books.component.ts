import {Component, HostListener, OnInit, QueryList, ViewChildren} from '@angular/core';
import {ConfirmDialogService} from '../../modules/confirm-dialog/confirm-dialog.service';
import {BooksService} from '../../services/book.service';
import {Observable} from 'rxjs';
import {Book} from '../../../store/book/models/book';
import {NgbdSortableHeaderDirective, SortEvent} from '../../directives/ngbd-sortable-header.directive';
import {BookDialogComponent} from '../book-dialog/book-dialog.component';
import {NgbModal, NgbModalConfig} from '@ng-bootstrap/ng-bootstrap';
import {BookStatistics} from '../../models/bookStatistics';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.scss']
})
export class BooksComponent implements OnInit {
  books$: Observable<Book[]>;
  bookStatistics$: Observable<BookStatistics>;
  total$: Observable<number>;
  warningText: string;
  showTotals = false;

  @ViewChildren(NgbdSortableHeaderDirective) headers: QueryList<NgbdSortableHeaderDirective>;

  constructor(public service: BooksService,
              private confirmDialogService: ConfirmDialogService,
              private config: NgbModalConfig,
              private modalService: NgbModal) {
    config.backdrop = 'static';
    config.keyboard = true;
    config.size = 'xl';
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    switch (event.key) {
      case 'F1':
        this.showTotals = !this.showTotals;
        event.preventDefault();
        event.stopPropagation();
        break;
    }
  }

  ngOnInit(): void {
    this.books$ = this.service.books$;
    this.total$ = this.service.total$;
    this.bookStatistics$ = this.service.bookStatistics$;
    this.service.refresh();
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

  handleDelete(content, book) {
    console.log('Delete ' + book.title);
    this.service.getNrOfOrders(book).subscribe(nrOfOrders => {
      if (nrOfOrders === 0) {
        this.service.delete(book.isbn);
      } else {
        this.warningText = 'Boek is nog aan ' + nrOfOrders + ' verkopen gekoppeld.';
        this.modalService.open(content, { size: 'lg' });
      }
    });
  }

  handleEdit(book) {
    const modalRef = this.modalService.open(BookDialogComponent);
    modalRef.componentInstance.book = book;
    modalRef.componentInstance.bNew = false;
    modalRef.componentInstance.service = this.service;
    modalRef.componentInstance.procurementService = null;
  }

}
