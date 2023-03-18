import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Configuracion_de_NotificacionComponent } from './Configuracion_de_Notificacion-add-edit/Configuracion_de_Notificacion.component';
import { ListConfiguracion_de_NotificacionComponent } from './list-Configuracion_de_Notificacion/list-Configuracion_de_Notificacion.component';
import { ShowAdvanceFilterConfiguracion_de_NotificacionComponent } from './show-advance-filter-Configuracion_de_Notificacion/show-advance-filter-Configuracion_de_Notificacion.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListConfiguracion_de_NotificacionComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Configuracion_de_NotificacionComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Configuracion_de_NotificacionComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Configuracion_de_NotificacionComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterConfiguracion_de_NotificacionComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Configuracion_de_NotificacionRoutingModule {
 }

