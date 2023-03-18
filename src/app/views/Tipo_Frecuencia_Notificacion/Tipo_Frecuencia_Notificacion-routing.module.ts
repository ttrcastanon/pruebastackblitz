import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Tipo_Frecuencia_NotificacionComponent } from './Tipo_Frecuencia_Notificacion-add-edit/Tipo_Frecuencia_Notificacion.component';
import { ListTipo_Frecuencia_NotificacionComponent } from './list-Tipo_Frecuencia_Notificacion/list-Tipo_Frecuencia_Notificacion.component';
import { ShowAdvanceFilterTipo_Frecuencia_NotificacionComponent } from './show-advance-filter-Tipo_Frecuencia_Notificacion/show-advance-filter-Tipo_Frecuencia_Notificacion.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListTipo_Frecuencia_NotificacionComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Tipo_Frecuencia_NotificacionComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Tipo_Frecuencia_NotificacionComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Tipo_Frecuencia_NotificacionComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterTipo_Frecuencia_NotificacionComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Tipo_Frecuencia_NotificacionRoutingModule {
 }

