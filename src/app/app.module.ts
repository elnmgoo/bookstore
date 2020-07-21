import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { SalesComponent } from './components/sales/sales.component';
import { ItemsComponent } from './components/items/items.component';
import {FormsModule} from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import {ItemReducer} from '../store/items/reducers/Item.reducer';
import {EffectsModule} from '@ngrx/effects';
import {ItemEffects} from '../store/items/effects/item.effects';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import {ItemService} from '../store/items/services/item.service';

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
    StoreModule.forRoot({items : ItemReducer}),
    EffectsModule.forRoot([ItemEffects])
  ],
  providers: [ItemService],
  bootstrap: [AppComponent]
})
export class AppModule { }
