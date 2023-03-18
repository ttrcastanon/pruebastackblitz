import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Estatus_AeronaveComponent } from './Estatus_Aeronave-add-edit/Estatus_Aeronave.component';
import { ListEstatus_AeronaveComponent } from './list-Estatus_Aeronave/list-Estatus_Aeronave.component';
import { ShowAdvanceFilterEstatus_AeronaveComponent } from './show-advance-filter-Estatus_Aeronave/show-advance-filter-Estatus_Aeronave.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListEstatus_AeronaveComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Estatus_AeronaveComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Estatus_AeronaveComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Estatus_AeronaveComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterEstatus_AeronaveComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Estatus_AeronaveRoutingModule {
 }

