import {Component, OnDestroy, OnInit, QueryList, ViewChildren} from '@angular/core';
import {Observable} from 'rxjs';
import {FormGroup} from '@angular/forms';
import {NgbdSortableHeaderDirective, SortEvent} from '../../directives/ngbd-sortable-header.directive';
import {NgbCalendar, NgbDate, NgbModal, NgbModalConfig} from '@ng-bootstrap/ng-bootstrap';
import {ProcurementService} from '../../services/procurement.service';
import {Procurement} from '../../models/procurement';
import {Book} from '../../../store/book/models/book';
import {BookDialogComponent} from '../book-dialog/book-dialog.component';
import {BooksService} from '../../services/book.service';


@Component({
  selector: 'app-procurement',
  templateUrl: './procurement.component.html',
  styleUrls: ['./procurement.component.scss']
})
export class ProcurementComponent implements OnInit, OnDestroy {
  procurement$: Observable<Procurement[]>;
  searchPriceTotal$: Observable<number>;
  total$: Observable<number>;
  tableForm: FormGroup;

  @ViewChildren(NgbdSortableHeaderDirective) headers: QueryList<NgbdSortableHeaderDirective>;

  constructor(public service: ProcurementService,
              private bookService: BooksService,
              private calendar: NgbCalendar,
              private config: NgbModalConfig,
              private modalService: NgbModal) {
    config.backdrop = 'static';
    config.keyboard = true;
    config.size = 'xl';
    this.procurement$ = service.procurement$;
    this.total$ = service.total$;
    this.searchPriceTotal$ = service.searchPriceTotal$;
  }

  ngOnDestroy(): void {
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

  handleDelete(procurement) {
    this.service.delete(procurement.id);
  }

  onButtonToday() {
    this.service.startFromDate = this.calendar.getToday();
    this.service.endUntilDate = this.calendar.getToday();
  }

  onButtonYear() {
    this.service.startFromDate = NgbDate.from({year: this.calendar.getToday().year, month: 1, day: 1});
    this.service.endUntilDate = NgbDate.from({year: this.calendar.getToday().year, month: 12, day: 31});
  }

  onButtonAdd() {
    const book: Book = new Book('', '', '', 0, null, 0, false);
    const modalRef = this.modalService.open(BookDialogComponent);
    modalRef.componentInstance.book = book;
    modalRef.componentInstance.bNew = true;
    modalRef.componentInstance.service = this.bookService;
    modalRef.componentInstance.procurementService = this.service;
  }

  ngOnInit(): void {
  }
}

