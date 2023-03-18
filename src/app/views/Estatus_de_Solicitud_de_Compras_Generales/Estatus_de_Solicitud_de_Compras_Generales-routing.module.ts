import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Estatus_de_Solicitud_de_Compras_GeneralesComponent } from './Estatus_de_Solicitud_de_Compras_Generales-add-edit/Estatus_de_Solicitud_de_Compras_Generales.component';
import { ListEstatus_de_Solicitud_de_Compras_GeneralesComponent } from './list-Estatus_de_Solicitud_de_Compras_Generales/list-Estatus_de_Solicitud_de_Compras_Generales.component';
import { ShowAdvanceFilterEstatus_de_Solicitud_de_Compras_GeneralesComponent } from './show-advance-filter-Estatus_de_Solicitud_de_Compras_Generales/show-advance-filter-Estatus_de_Solicitud_de_Compras_Generales.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListEstatus_de_Solicitud_de_Compras_GeneralesComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Estatus_de_Solicitud_de_Compras_GeneralesComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Estatus_de_Solicitud_de_Compras_GeneralesComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Estatus_de_Solicitud_de_Compras_GeneralesComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterEstatus_de_Solicitud_de_Compras_GeneralesComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Estatus_de_Solicitud_de_Compras_GeneralesRoutingModule {
 }

