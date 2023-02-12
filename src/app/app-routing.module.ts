import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SalesComponent} from './components/kassa/sales.component';
import {ArtikelenComponent} from './components/artikelen/artikelen.component';
import {VerkochtComponent} from './components/verkocht/verkocht.component';
import {BoekenComponent} from './components/boeken/boeken.component';
import {UitgeversComponent} from './components/uitgevers/uitgevers.component';
import {InkoopComponent} from './components/inkoop/inkoop.component';


const routes: Routes = [
  { path: '', redirectTo: '/sales', pathMatch: 'full' },
  { path: 'sales', component: SalesComponent },
  { path: 'items', component: ArtikelenComponent },
  { path: 'purchaseOrders', component: VerkochtComponent},
  { path: 'books', component: BoekenComponent},
  { path: 'publishers', component: UitgeversComponent},
  { path: 'procurement', component: InkoopComponent},
  { path: '**', redirectTo: '/sales', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
