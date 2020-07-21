import {Component, NgModule} from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {SalesComponent} from './components/sales/sales.component';
import {ItemsComponent} from './components/items/items.component';


const routes: Routes = [
  { path: '', redirectTo: '/sales', pathMatch: 'full' },
  { path: 'sales', component: SalesComponent },
  { path: 'items', component: ItemsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
