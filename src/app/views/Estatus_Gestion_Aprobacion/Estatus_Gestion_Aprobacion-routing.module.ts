import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Estatus_Gestion_AprobacionComponent } from './Estatus_Gestion_Aprobacion-add-edit/Estatus_Gestion_Aprobacion.component';
import { ListEstatus_Gestion_AprobacionComponent } from './list-Estatus_Gestion_Aprobacion/list-Estatus_Gestion_Aprobacion.component';
import { ShowAdvanceFilterEstatus_Gestion_AprobacionComponent } from './show-advance-filter-Estatus_Gestion_Aprobacion/show-advance-filter-Estatus_Gestion_Aprobacion.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListEstatus_Gestion_AprobacionComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Estatus_Gestion_AprobacionComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Estatus_Gestion_AprobacionComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Estatus_Gestion_AprobacionComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterEstatus_Gestion_AprobacionComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Estatus_Gestion_AprobacionRoutingModule {
 }

