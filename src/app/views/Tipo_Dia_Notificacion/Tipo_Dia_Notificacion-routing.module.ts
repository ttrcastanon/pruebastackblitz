import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Tipo_Dia_NotificacionComponent } from './Tipo_Dia_Notificacion-add-edit/Tipo_Dia_Notificacion.component';
import { ListTipo_Dia_NotificacionComponent } from './list-Tipo_Dia_Notificacion/list-Tipo_Dia_Notificacion.component';
import { ShowAdvanceFilterTipo_Dia_NotificacionComponent } from './show-advance-filter-Tipo_Dia_Notificacion/show-advance-filter-Tipo_Dia_Notificacion.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListTipo_Dia_NotificacionComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Tipo_Dia_NotificacionComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Tipo_Dia_NotificacionComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Tipo_Dia_NotificacionComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterTipo_Dia_NotificacionComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Tipo_Dia_NotificacionRoutingModule {
 }

