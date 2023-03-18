import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { ProcedenciaComponent } from './Procedencia-add-edit/Procedencia.component';
import { ListProcedenciaComponent } from './list-Procedencia/list-Procedencia.component';
import { ShowAdvanceFilterProcedenciaComponent } from './show-advance-filter-Procedencia/show-advance-filter-Procedencia.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListProcedenciaComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: ProcedenciaComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: ProcedenciaComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: ProcedenciaComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterProcedenciaComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class ProcedenciaRoutingModule {
 }

