import {DecimalPipe} from '@angular/common';
import {Component, OnDestroy, OnInit, QueryList, ViewChildren} from '@angular/core';

import {Observable, Subscription} from 'rxjs';
import {PurchaseOrder} from '../../models/purchaseOrder';
import {PurchaseOrdersService} from '../../services/purchase-orders.service';
import {NgbdSortableHeaderDirective, SortEvent} from '../../directives/ngbd-sortable-header.directive';
import {ConfirmDialogService} from '../../modules/confirm-dialog/confirm-dialog.service';
import {NgbCalendar, NgbDate, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import {FormGroup, Validators} from '@angular/forms';
import {BtwTotal} from '../../models/btwTotal';

@Component({
  selector: 'app-orders',
  templateUrl: './purchase-orders.component.html',
  styleUrls: ['./purchase-orders.component.scss'],
  providers: [PurchaseOrdersService, DecimalPipe]
})
export class PurchaseOrdersComponent implements OnInit, OnDestroy {
  purchaseOrders$: Observable<PurchaseOrder[]>;
  searchBtwTotal$: Observable<BtwTotal[]>;
  total$: Observable<number>;
  tableForm: FormGroup;
  theBtwTotal: BtwTotal;
  subscription: Subscription;

  @ViewChildren(NgbdSortableHeaderDirective) headers: QueryList<NgbdSortableHeaderDirective>;

  constructor(public service: PurchaseOrdersService,
              private confirmDialogService: ConfirmDialogService,
              private calendar: NgbCalendar) {
    this.purchaseOrders$ = service.purchaseOrders$;
    this.searchBtwTotal$ = service.searchBtwTotal$;
    this.total$ = service.total$;
    this.theBtwTotal = new BtwTotal();
    this.subscription = this.searchBtwTotal$.subscribe(btwTotals => {
      this.theBtwTotal.totalBtw = 0;
      this.theBtwTotal.totalWithBtw = 0;
      this.theBtwTotal.totalWithoutBtw = 0;
      btwTotals.forEach(btwTotal => {
        this.theBtwTotal.totalBtw += btwTotal.totalBtw;
        this.theBtwTotal.totalWithBtw += btwTotal.totalWithBtw;
        this.theBtwTotal.totalWithoutBtw += btwTotal.totalWithoutBtw;
      });
      console.log('total ' + this.theBtwTotal.totalWithoutBtw);
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
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

  handleDelete(purchaseOrder) {
    console.log('Delete ' + purchaseOrder.id + ' ' + purchaseOrder.description);
    const item = (purchaseOrder.description == null ||
      purchaseOrder.description.length < 1) ? purchaseOrder.title : purchaseOrder.description;
    const text = 'Verwijder "' + item + '"';
    this.confirmDialogService.confirmThis(text, () => {
      this.service.delete(purchaseOrder.id);
    }, () => {
      alert('No clicked');
    });
  }

  onButtonToday() {
    this.service.startFromDate = this.calendar.getToday();
    this.service.endUntilDate = this.calendar.getToday();
  }

  onButtonYear() {
    this.service.startFromDate = NgbDate.from({year: this.calendar.getToday().year, month: 1, day: 1});
    this.service.endUntilDate = NgbDate.from({year: this.calendar.getToday().year, month: 12, day: 31});
  }

  ngOnInit(): void {

  }
}
