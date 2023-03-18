import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Solicitud_de_Servicios_para_OperacionesComponent } from './Solicitud_de_Servicios_para_Operaciones-add-edit/Solicitud_de_Servicios_para_Operaciones.component';
import { ListSolicitud_de_Servicios_para_OperacionesComponent } from './list-Solicitud_de_Servicios_para_Operaciones/list-Solicitud_de_Servicios_para_Operaciones.component';
import { ShowAdvanceFilterSolicitud_de_Servicios_para_OperacionesComponent } from './show-advance-filter-Solicitud_de_Servicios_para_Operaciones/show-advance-filter-Solicitud_de_Servicios_para_Operaciones.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListSolicitud_de_Servicios_para_OperacionesComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Solicitud_de_Servicios_para_OperacionesComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Solicitud_de_Servicios_para_OperacionesComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Solicitud_de_Servicios_para_OperacionesComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterSolicitud_de_Servicios_para_OperacionesComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Solicitud_de_Servicios_para_OperacionesRoutingModule {
 }

