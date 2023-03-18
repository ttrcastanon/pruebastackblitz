import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Tipo_de_NotificacionComponent } from './Tipo_de_Notificacion-add-edit/Tipo_de_Notificacion.component';
import { ListTipo_de_NotificacionComponent } from './list-Tipo_de_Notificacion/list-Tipo_de_Notificacion.component';
import { ShowAdvanceFilterTipo_de_NotificacionComponent } from './show-advance-filter-Tipo_de_Notificacion/show-advance-filter-Tipo_de_Notificacion.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListTipo_de_NotificacionComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Tipo_de_NotificacionComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Tipo_de_NotificacionComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Tipo_de_NotificacionComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterTipo_de_NotificacionComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Tipo_de_NotificacionRoutingModule {
 }

