import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Estatus_autorizacion_de_prefacturaComponent } from './Estatus_autorizacion_de_prefactura-add-edit/Estatus_autorizacion_de_prefactura.component';
import { ListEstatus_autorizacion_de_prefacturaComponent } from './list-Estatus_autorizacion_de_prefactura/list-Estatus_autorizacion_de_prefactura.component';
import { ShowAdvanceFilterEstatus_autorizacion_de_prefacturaComponent } from './show-advance-filter-Estatus_autorizacion_de_prefactura/show-advance-filter-Estatus_autorizacion_de_prefactura.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListEstatus_autorizacion_de_prefacturaComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Estatus_autorizacion_de_prefacturaComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Estatus_autorizacion_de_prefacturaComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Estatus_autorizacion_de_prefacturaComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterEstatus_autorizacion_de_prefacturaComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Estatus_autorizacion_de_prefacturaRoutingModule {
 }

