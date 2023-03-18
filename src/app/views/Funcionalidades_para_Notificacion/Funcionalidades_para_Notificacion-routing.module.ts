import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Funcionalidades_para_NotificacionComponent } from './Funcionalidades_para_Notificacion-add-edit/Funcionalidades_para_Notificacion.component';
import { ListFuncionalidades_para_NotificacionComponent } from './list-Funcionalidades_para_Notificacion/list-Funcionalidades_para_Notificacion.component';
import { ShowAdvanceFilterFuncionalidades_para_NotificacionComponent } from './show-advance-filter-Funcionalidades_para_Notificacion/show-advance-filter-Funcionalidades_para_Notificacion.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListFuncionalidades_para_NotificacionComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Funcionalidades_para_NotificacionComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Funcionalidades_para_NotificacionComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Funcionalidades_para_NotificacionComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterFuncionalidades_para_NotificacionComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Funcionalidades_para_NotificacionRoutingModule {
 }

