import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Tipo_de_Notificacion_PushComponent } from './Tipo_de_Notificacion_Push-add-edit/Tipo_de_Notificacion_Push.component';
import { ListTipo_de_Notificacion_PushComponent } from './list-Tipo_de_Notificacion_Push/list-Tipo_de_Notificacion_Push.component';
import { ShowAdvanceFilterTipo_de_Notificacion_PushComponent } from './show-advance-filter-Tipo_de_Notificacion_Push/show-advance-filter-Tipo_de_Notificacion_Push.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListTipo_de_Notificacion_PushComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Tipo_de_Notificacion_PushComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Tipo_de_Notificacion_PushComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Tipo_de_Notificacion_PushComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterTipo_de_Notificacion_PushComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Tipo_de_Notificacion_PushRoutingModule {
 }

