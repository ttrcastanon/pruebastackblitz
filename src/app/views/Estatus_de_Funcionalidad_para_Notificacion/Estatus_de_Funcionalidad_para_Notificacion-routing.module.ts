import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Estatus_de_Funcionalidad_para_NotificacionComponent } from './Estatus_de_Funcionalidad_para_Notificacion-add-edit/Estatus_de_Funcionalidad_para_Notificacion.component';
import { ListEstatus_de_Funcionalidad_para_NotificacionComponent } from './list-Estatus_de_Funcionalidad_para_Notificacion/list-Estatus_de_Funcionalidad_para_Notificacion.component';
import { ShowAdvanceFilterEstatus_de_Funcionalidad_para_NotificacionComponent } from './show-advance-filter-Estatus_de_Funcionalidad_para_Notificacion/show-advance-filter-Estatus_de_Funcionalidad_para_Notificacion.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListEstatus_de_Funcionalidad_para_NotificacionComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Estatus_de_Funcionalidad_para_NotificacionComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Estatus_de_Funcionalidad_para_NotificacionComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Estatus_de_Funcionalidad_para_NotificacionComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterEstatus_de_Funcionalidad_para_NotificacionComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Estatus_de_Funcionalidad_para_NotificacionRoutingModule {
 }

