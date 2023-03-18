import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { DepartamentoComponent } from './Departamento-add-edit/Departamento.component';
import { ListDepartamentoComponent } from './list-Departamento/list-Departamento.component';
import { ShowAdvanceFilterDepartamentoComponent } from './show-advance-filter-Departamento/show-advance-filter-Departamento.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListDepartamentoComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: DepartamentoComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: DepartamentoComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: DepartamentoComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterDepartamentoComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class DepartamentoRoutingModule {
 }

