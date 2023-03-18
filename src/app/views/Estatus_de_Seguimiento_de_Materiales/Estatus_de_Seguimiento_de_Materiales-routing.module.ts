import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Estatus_de_Seguimiento_de_MaterialesComponent } from './Estatus_de_Seguimiento_de_Materiales-add-edit/Estatus_de_Seguimiento_de_Materiales.component';
import { ListEstatus_de_Seguimiento_de_MaterialesComponent } from './list-Estatus_de_Seguimiento_de_Materiales/list-Estatus_de_Seguimiento_de_Materiales.component';
import { ShowAdvanceFilterEstatus_de_Seguimiento_de_MaterialesComponent } from './show-advance-filter-Estatus_de_Seguimiento_de_Materiales/show-advance-filter-Estatus_de_Seguimiento_de_Materiales.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListEstatus_de_Seguimiento_de_MaterialesComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Estatus_de_Seguimiento_de_MaterialesComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Estatus_de_Seguimiento_de_MaterialesComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Estatus_de_Seguimiento_de_MaterialesComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterEstatus_de_Seguimiento_de_MaterialesComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Estatus_de_Seguimiento_de_MaterialesRoutingModule {
 }

