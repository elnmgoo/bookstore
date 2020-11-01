import {DecimalPipe} from '@angular/common';
import {Component, OnInit, QueryList, ViewChildren} from '@angular/core';

import {Observable} from 'rxjs';
import {PurchaseOrder} from '../../models/purchaseOrder';
import {PurchaseOrdersService} from '../../services/purchase-orders.service';
import {NgbdSortableHeaderDirective, SortEvent} from '../../directives/ngbd-sortable-header.directive';
import {ConfirmDialogService} from '../../modules/confirm-dialog/confirm-dialog.service';

@Component({
  selector: 'app-orders',
  templateUrl: './purchase-orders.component.html',
  styleUrls: ['./purchase-orders.component.scss'],
  providers: [PurchaseOrdersService, DecimalPipe]
})
export class PurchaseOrdersComponent implements OnInit {

  purchaseOrders$: Observable<PurchaseOrder[]>;
  total$: Observable<number>;

  @ViewChildren(NgbdSortableHeaderDirective) headers: QueryList<NgbdSortableHeaderDirective>;

  constructor(public service: PurchaseOrdersService, private confirmDialogService: ConfirmDialogService) {
    this.purchaseOrders$ = service.purchaseOrders$;
    this.total$ = service.total$;
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

  ngOnInit(): void {
  }
}
