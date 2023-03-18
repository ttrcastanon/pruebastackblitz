import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Estatus_de_CalibracionComponent } from './Estatus_de_Calibracion-add-edit/Estatus_de_Calibracion.component';
import { ListEstatus_de_CalibracionComponent } from './list-Estatus_de_Calibracion/list-Estatus_de_Calibracion.component';
import { ShowAdvanceFilterEstatus_de_CalibracionComponent } from './show-advance-filter-Estatus_de_Calibracion/show-advance-filter-Estatus_de_Calibracion.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListEstatus_de_CalibracionComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Estatus_de_CalibracionComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Estatus_de_CalibracionComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Estatus_de_CalibracionComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterEstatus_de_CalibracionComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Estatus_de_CalibracionRoutingModule {
 }

