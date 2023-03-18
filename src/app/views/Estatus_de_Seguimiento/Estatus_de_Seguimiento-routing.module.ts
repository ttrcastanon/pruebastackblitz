import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Estatus_de_SeguimientoComponent } from './Estatus_de_Seguimiento-add-edit/Estatus_de_Seguimiento.component';
import { ListEstatus_de_SeguimientoComponent } from './list-Estatus_de_Seguimiento/list-Estatus_de_Seguimiento.component';
import { ShowAdvanceFilterEstatus_de_SeguimientoComponent } from './show-advance-filter-Estatus_de_Seguimiento/show-advance-filter-Estatus_de_Seguimiento.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListEstatus_de_SeguimientoComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Estatus_de_SeguimientoComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Estatus_de_SeguimientoComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Estatus_de_SeguimientoComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterEstatus_de_SeguimientoComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Estatus_de_SeguimientoRoutingModule {
 }

