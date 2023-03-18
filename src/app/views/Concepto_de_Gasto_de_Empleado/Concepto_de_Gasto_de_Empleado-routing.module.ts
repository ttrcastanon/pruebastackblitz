import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Concepto_de_Gasto_de_EmpleadoComponent } from './Concepto_de_Gasto_de_Empleado-add-edit/Concepto_de_Gasto_de_Empleado.component';
import { ListConcepto_de_Gasto_de_EmpleadoComponent } from './list-Concepto_de_Gasto_de_Empleado/list-Concepto_de_Gasto_de_Empleado.component';
import { ShowAdvanceFilterConcepto_de_Gasto_de_EmpleadoComponent } from './show-advance-filter-Concepto_de_Gasto_de_Empleado/show-advance-filter-Concepto_de_Gasto_de_Empleado.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListConcepto_de_Gasto_de_EmpleadoComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Concepto_de_Gasto_de_EmpleadoComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Concepto_de_Gasto_de_EmpleadoComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Concepto_de_Gasto_de_EmpleadoComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterConcepto_de_Gasto_de_EmpleadoComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Concepto_de_Gasto_de_EmpleadoRoutingModule {
 }

