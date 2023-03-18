import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Estatus_de_ClienteComponent } from './Estatus_de_Cliente-add-edit/Estatus_de_Cliente.component';
import { ListEstatus_de_ClienteComponent } from './list-Estatus_de_Cliente/list-Estatus_de_Cliente.component';
import { ShowAdvanceFilterEstatus_de_ClienteComponent } from './show-advance-filter-Estatus_de_Cliente/show-advance-filter-Estatus_de_Cliente.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListEstatus_de_ClienteComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Estatus_de_ClienteComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Estatus_de_ClienteComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Estatus_de_ClienteComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterEstatus_de_ClienteComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Estatus_de_ClienteRoutingModule {
 }

