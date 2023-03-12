import {BrowserModule} from '@angular/platform-browser';
import {LOCALE_ID, NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HeaderComponent} from './components/header/header.component';
import {KassaComponent} from './components/kassa/kassa.component';
import {ArtikelenComponent} from './components/artikelen/artikelen.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {StoreModule} from '@ngrx/store';
import {EffectsModule} from '@ngrx/effects';
import {ItemEffects} from '../store/items/effects/item.effects';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import {ItemService} from '../store/items/services/item.service';
import {appReducers} from '../store/app.reducers';
import {NgxMaskDirective, NgxMaskPipe, provideEnvironmentNgxMask} from 'ngx-mask';
import {OrderService} from '../store/orders/services/order.service';
import {OrderEffects} from '../store/orders/effects/order.effects';
import {PublisherEffects} from '../store/publishers/effects/publisher.effects';
import {PublisherService} from '../store/publishers/services/publisher.service';
import {BookService} from '../store/book/service/book.service';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {DateFormatPipe2Time} from './components/kassa/DateFormatPipe2Time';
import {DateFormatPipe2Date} from './components/kassa/DateFormatPipe2Date';
import {PrintService} from '../store/book/service/print.service';
import {DecimalPipe, registerLocaleData} from '@angular/common';
import localeNl from '@angular/common/locales/nl';
import {LoginComponent} from './components/login/login.component';
import {VerkochtComponent} from './components/verkocht/verkocht.component';
import {PurchaseOrdersService} from './services/purchase-orders.service';
import {NgbdSortableHeaderDirective} from './directives/ngbd-sortable-header.directive';
import {ConfirmDialogService} from './modules/confirm-dialog/confirm-dialog.service';
import {ConfirmDialogModule} from './modules/confirm-dialog/confirm-dialog.module';
import { BoekenComponent } from './components/boeken/boeken.component';
import {BooksService} from './services/book.service';
import { BoekDialogComponent } from './components/boek-dialog/boek-dialog.component';
import { UitgeversComponent } from './components/uitgevers/uitgevers.component';
import { InkoopComponent } from './components/inkoop/inkoop.component';
import { NoCacheHeadersInterceptor } from './interceptors/NoCacheHeadersInterceptor';


registerLocaleData(localeNl, 'nl');

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    KassaComponent,
    ArtikelenComponent,
    LoginComponent,
    VerkochtComponent,
    NgbdSortableHeaderDirective,
    BoekenComponent,
    BoekDialogComponent,
    UitgeversComponent,
    InkoopComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    NgxMaskDirective, NgxMaskPipe,
    StoreModule.forRoot(appReducers),
    EffectsModule.forRoot([ItemEffects, OrderEffects, PublisherEffects]),
    ReactiveFormsModule,
    NgbModule,
    ConfirmDialogModule
  ],
  providers: [
    {
    provide: HTTP_INTERCEPTORS,
    useClass: NoCacheHeadersInterceptor,
    multi: true
  }, {
    provide: LOCALE_ID,
    useValue: 'nl'
  }, ItemService, OrderService, PurchaseOrdersService, PublisherService, BookService, DateFormatPipe2Date, DateFormatPipe2Time,
    PrintService, ConfirmDialogService, BooksService, DecimalPipe, provideEnvironmentNgxMask()],
  bootstrap: [AppComponent]
})
export class AppModule {
}
