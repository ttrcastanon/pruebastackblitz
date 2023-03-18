import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Estatus_de_facturacion_de_vueloComponent } from './Estatus_de_facturacion_de_vuelo-add-edit/Estatus_de_facturacion_de_vuelo.component';
import { ListEstatus_de_facturacion_de_vueloComponent } from './list-Estatus_de_facturacion_de_vuelo/list-Estatus_de_facturacion_de_vuelo.component';
import { ShowAdvanceFilterEstatus_de_facturacion_de_vueloComponent } from './show-advance-filter-Estatus_de_facturacion_de_vuelo/show-advance-filter-Estatus_de_facturacion_de_vuelo.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListEstatus_de_facturacion_de_vueloComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Estatus_de_facturacion_de_vueloComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Estatus_de_facturacion_de_vueloComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Estatus_de_facturacion_de_vueloComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterEstatus_de_facturacion_de_vueloComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Estatus_de_facturacion_de_vueloRoutingModule {
 }

