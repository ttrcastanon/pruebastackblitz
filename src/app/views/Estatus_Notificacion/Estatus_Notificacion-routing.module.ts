import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Estatus_NotificacionComponent } from './Estatus_Notificacion-add-edit/Estatus_Notificacion.component';
import { ListEstatus_NotificacionComponent } from './list-Estatus_Notificacion/list-Estatus_Notificacion.component';
import { ShowAdvanceFilterEstatus_NotificacionComponent } from './show-advance-filter-Estatus_Notificacion/show-advance-filter-Estatus_Notificacion.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListEstatus_NotificacionComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Estatus_NotificacionComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Estatus_NotificacionComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Estatus_NotificacionComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterEstatus_NotificacionComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Estatus_NotificacionRoutingModule {
 }

