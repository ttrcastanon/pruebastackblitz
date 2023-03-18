import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Estatus_de_RequeridoComponent } from './Estatus_de_Requerido-add-edit/Estatus_de_Requerido.component';
import { ListEstatus_de_RequeridoComponent } from './list-Estatus_de_Requerido/list-Estatus_de_Requerido.component';
import { ShowAdvanceFilterEstatus_de_RequeridoComponent } from './show-advance-filter-Estatus_de_Requerido/show-advance-filter-Estatus_de_Requerido.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListEstatus_de_RequeridoComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Estatus_de_RequeridoComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Estatus_de_RequeridoComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Estatus_de_RequeridoComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterEstatus_de_RequeridoComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Estatus_de_RequeridoRoutingModule {
 }

