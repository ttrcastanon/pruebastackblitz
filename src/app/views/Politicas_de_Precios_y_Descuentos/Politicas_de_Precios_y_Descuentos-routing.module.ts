import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Politicas_de_Precios_y_DescuentosComponent } from './Politicas_de_Precios_y_Descuentos-add-edit/Politicas_de_Precios_y_Descuentos.component';
import { ListPoliticas_de_Precios_y_DescuentosComponent } from './list-Politicas_de_Precios_y_Descuentos/list-Politicas_de_Precios_y_Descuentos.component';
import { ShowAdvanceFilterPoliticas_de_Precios_y_DescuentosComponent } from './show-advance-filter-Politicas_de_Precios_y_Descuentos/show-advance-filter-Politicas_de_Precios_y_Descuentos.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListPoliticas_de_Precios_y_DescuentosComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Politicas_de_Precios_y_DescuentosComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Politicas_de_Precios_y_DescuentosComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Politicas_de_Precios_y_DescuentosComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterPoliticas_de_Precios_y_DescuentosComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Politicas_de_Precios_y_DescuentosRoutingModule {
 }

