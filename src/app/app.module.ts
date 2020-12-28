import {BrowserModule} from '@angular/platform-browser';
import {LOCALE_ID, NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HeaderComponent} from './components/header/header.component';
import {SalesComponent} from './components/sales/sales.component';
import {ItemsComponent} from './components/items/items.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {StoreModule} from '@ngrx/store';
import {EffectsModule} from '@ngrx/effects';
import {ItemEffects} from '../store/items/effects/item.effects';
import {HttpClientModule, HttpClient} from '@angular/common/http';
import {ItemService} from '../store/items/services/item.service';
import {appReducers} from '../store/app.reducers';
import {NgxMaskModule, IConfig} from 'ngx-mask';
import {OrderService} from '../store/orders/services/order.service';
import {OrderEffects} from '../store/orders/effects/order.effects';
import {PublisherEffects} from '../store/publishers/effects/publisher.effects';
import {PublisherService} from '../store/publishers/services/publisher.service';
import {BookService} from '../store/book/service/book.service';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {DateFormatPipe2Time} from './components/sales/DateFormatPipe2Time';
import {DateFormatPipe2Date} from './components/sales/DateFormatPipe2Date';
import {PrintService} from '../store/book/service/print.service';
import {DecimalPipe, registerLocaleData} from '@angular/common';
import localeNl from '@angular/common/locales/nl';
import {LoginComponent} from './components/login/login.component';
import {PurchaseOrdersComponent} from './components/purchaseOrders/purchase-orders.component';
import {PurchaseOrdersService} from './services/purchase-orders.service';
import {NgbdSortableHeaderDirective} from './directives/ngbd-sortable-header.directive';
import {ConfirmDialogService} from './modules/confirm-dialog/confirm-dialog.service';
import {ConfirmDialogModule} from './modules/confirm-dialog/confirm-dialog.module';
import { BooksComponent } from './components/books/books.component';
import {BooksService} from './services/book.service';
import { BookDialogComponent } from './components/book-dialog/book-dialog.component';
import { PublishersComponent } from './components/publishers/publishers.component';
import { ProcurementComponent } from './components/procurement/procurement.component';


registerLocaleData(localeNl, 'nl');

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SalesComponent,
    ItemsComponent,
    LoginComponent,
    PurchaseOrdersComponent,
    NgbdSortableHeaderDirective,
    BooksComponent,
    BookDialogComponent,
    PublishersComponent,
    ProcurementComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    NgxMaskModule.forRoot(),
    StoreModule.forRoot(appReducers),
    EffectsModule.forRoot([ItemEffects, OrderEffects, PublisherEffects]),
    ReactiveFormsModule,
    NgbModule,
    ConfirmDialogModule
  ],
  providers: [{
    provide: LOCALE_ID,
    useValue: 'nl'
  }, ItemService, OrderService, PurchaseOrdersService, PublisherService, BookService, DateFormatPipe2Date, DateFormatPipe2Time,
    PrintService, ConfirmDialogService, BooksService, DecimalPipe],
  bootstrap: [AppComponent]
})
export class AppModule {
}
