import {Component, NgModule} from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {SalesComponent} from './components/sales/sales.component';
import {ItemsComponent} from './components/items/items.component';
import {PurchaseOrder} from './models/purchaseOrder';
import {PurchaseOrdersComponent} from './components/purchaseOrders/purchase-orders.component';
import {BooksComponent} from './components/books/books.component';
import {PublishersComponent} from './components/publishers/publishers.component';
import {ProcurementComponent} from './components/procurement/procurement.component';


const routes: Routes = [
  { path: '', redirectTo: '/sales', pathMatch: 'full' },
  { path: 'sales', component: SalesComponent },
  { path: 'items', component: ItemsComponent },
  { path: 'purchaseOrders', component: PurchaseOrdersComponent},
  { path: 'books', component: BooksComponent},
  { path: 'publishers', component: PublishersComponent},
  { path: 'procurement', component: ProcurementComponent},
  { path: '**', redirectTo: '/sales', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
