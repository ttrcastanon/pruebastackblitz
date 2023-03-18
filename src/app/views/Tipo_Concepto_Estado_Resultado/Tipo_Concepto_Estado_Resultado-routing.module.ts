import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Tipo_Concepto_Estado_ResultadoComponent } from './Tipo_Concepto_Estado_Resultado-add-edit/Tipo_Concepto_Estado_Resultado.component';
import { ListTipo_Concepto_Estado_ResultadoComponent } from './list-Tipo_Concepto_Estado_Resultado/list-Tipo_Concepto_Estado_Resultado.component';
import { ShowAdvanceFilterTipo_Concepto_Estado_ResultadoComponent } from './show-advance-filter-Tipo_Concepto_Estado_Resultado/show-advance-filter-Tipo_Concepto_Estado_Resultado.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListTipo_Concepto_Estado_ResultadoComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Tipo_Concepto_Estado_ResultadoComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Tipo_Concepto_Estado_ResultadoComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Tipo_Concepto_Estado_ResultadoComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterTipo_Concepto_Estado_ResultadoComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Tipo_Concepto_Estado_ResultadoRoutingModule {
 }

