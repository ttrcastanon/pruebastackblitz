import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Solicitud_de_Compras_GeneralesComponent } from './Solicitud_de_Compras_Generales-add-edit/Solicitud_de_Compras_Generales.component';
import { ListSolicitud_de_Compras_GeneralesComponent } from './list-Solicitud_de_Compras_Generales/list-Solicitud_de_Compras_Generales.component';
import { ShowAdvanceFilterSolicitud_de_Compras_GeneralesComponent } from './show-advance-filter-Solicitud_de_Compras_Generales/show-advance-filter-Solicitud_de_Compras_Generales.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListSolicitud_de_Compras_GeneralesComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'list/:id',
     component: ListSolicitud_de_Compras_GeneralesComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Solicitud_de_Compras_GeneralesComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Solicitud_de_Compras_GeneralesComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Solicitud_de_Compras_GeneralesComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterSolicitud_de_Compras_GeneralesComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Solicitud_de_Compras_GeneralesRoutingModule {
 }

