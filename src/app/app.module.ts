import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { SalesComponent } from './components/sales/sales.component';
import { ItemsComponent } from './components/items/items.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import {EffectsModule} from '@ngrx/effects';
import {ItemEffects} from '../store/items/effects/item.effects';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import {ItemService} from '../store/items/services/item.service';
import {appReducers} from '../store/app.reducers';
import { NgxMaskModule, IConfig } from 'ngx-mask';
import {OrderService} from '../store/orders/services/order.service';
import {OrderEffects} from '../store/orders/effects/order.effects';
import {PublisherEffects} from '../store/publishers/effects/publisher.effects';
import {PublisherService} from '../store/publishers/services/publisher.service';
import {BookService} from '../store/book/service/book.service';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SalesComponent,
    ItemsComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    NgxMaskModule.forRoot(),
    StoreModule.forRoot(appReducers),
    EffectsModule.forRoot([ItemEffects, OrderEffects, PublisherEffects]),
    ReactiveFormsModule
  ],
  providers: [ItemService, OrderService, PublisherService, BookService],
  bootstrap: [AppComponent]
})
export class AppModule { }
