import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Seguros_Asociados_a_la_AeronaveComponent } from './Seguros_Asociados_a_la_Aeronave-add-edit/Seguros_Asociados_a_la_Aeronave.component';
import { ListSeguros_Asociados_a_la_AeronaveComponent } from './list-Seguros_Asociados_a_la_Aeronave/list-Seguros_Asociados_a_la_Aeronave.component';
import { ShowAdvanceFilterSeguros_Asociados_a_la_AeronaveComponent } from './show-advance-filter-Seguros_Asociados_a_la_Aeronave/show-advance-filter-Seguros_Asociados_a_la_Aeronave.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListSeguros_Asociados_a_la_AeronaveComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Seguros_Asociados_a_la_AeronaveComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Seguros_Asociados_a_la_AeronaveComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Seguros_Asociados_a_la_AeronaveComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterSeguros_Asociados_a_la_AeronaveComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Seguros_Asociados_a_la_AeronaveRoutingModule {
 }

