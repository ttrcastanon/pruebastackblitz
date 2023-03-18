import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Estatus_TripulacionComponent } from './Estatus_Tripulacion-add-edit/Estatus_Tripulacion.component';
import { ListEstatus_TripulacionComponent } from './list-Estatus_Tripulacion/list-Estatus_Tripulacion.component';
import { ShowAdvanceFilterEstatus_TripulacionComponent } from './show-advance-filter-Estatus_Tripulacion/show-advance-filter-Estatus_Tripulacion.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListEstatus_TripulacionComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Estatus_TripulacionComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Estatus_TripulacionComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Estatus_TripulacionComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterEstatus_TripulacionComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Estatus_TripulacionRoutingModule {
 }

