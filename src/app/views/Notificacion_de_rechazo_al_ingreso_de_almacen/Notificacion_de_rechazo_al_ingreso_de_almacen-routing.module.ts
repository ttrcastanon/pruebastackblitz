import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Notificacion_de_rechazo_al_ingreso_de_almacenComponent } from './Notificacion_de_rechazo_al_ingreso_de_almacen-add-edit/Notificacion_de_rechazo_al_ingreso_de_almacen.component';
import { ListNotificacion_de_rechazo_al_ingreso_de_almacenComponent } from './list-Notificacion_de_rechazo_al_ingreso_de_almacen/list-Notificacion_de_rechazo_al_ingreso_de_almacen.component';
import { ShowAdvanceFilterNotificacion_de_rechazo_al_ingreso_de_almacenComponent } from './show-advance-filter-Notificacion_de_rechazo_al_ingreso_de_almacen/show-advance-filter-Notificacion_de_rechazo_al_ingreso_de_almacen.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListNotificacion_de_rechazo_al_ingreso_de_almacenComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Notificacion_de_rechazo_al_ingreso_de_almacenComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Notificacion_de_rechazo_al_ingreso_de_almacenComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Notificacion_de_rechazo_al_ingreso_de_almacenComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterNotificacion_de_rechazo_al_ingreso_de_almacenComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Notificacion_de_rechazo_al_ingreso_de_almacenRoutingModule {
 }

