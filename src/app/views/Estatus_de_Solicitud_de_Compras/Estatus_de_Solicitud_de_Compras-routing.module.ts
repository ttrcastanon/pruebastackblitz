import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Estatus_de_Solicitud_de_ComprasComponent } from './Estatus_de_Solicitud_de_Compras-add-edit/Estatus_de_Solicitud_de_Compras.component';
import { ListEstatus_de_Solicitud_de_ComprasComponent } from './list-Estatus_de_Solicitud_de_Compras/list-Estatus_de_Solicitud_de_Compras.component';
import { ShowAdvanceFilterEstatus_de_Solicitud_de_ComprasComponent } from './show-advance-filter-Estatus_de_Solicitud_de_Compras/show-advance-filter-Estatus_de_Solicitud_de_Compras.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListEstatus_de_Solicitud_de_ComprasComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Estatus_de_Solicitud_de_ComprasComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Estatus_de_Solicitud_de_ComprasComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Estatus_de_Solicitud_de_ComprasComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterEstatus_de_Solicitud_de_ComprasComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Estatus_de_Solicitud_de_ComprasRoutingModule {
 }

