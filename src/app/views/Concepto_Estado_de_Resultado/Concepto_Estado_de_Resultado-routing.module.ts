import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Concepto_Estado_de_ResultadoComponent } from './Concepto_Estado_de_Resultado-add-edit/Concepto_Estado_de_Resultado.component';
import { ListConcepto_Estado_de_ResultadoComponent } from './list-Concepto_Estado_de_Resultado/list-Concepto_Estado_de_Resultado.component';
import { ShowAdvanceFilterConcepto_Estado_de_ResultadoComponent } from './show-advance-filter-Concepto_Estado_de_Resultado/show-advance-filter-Concepto_Estado_de_Resultado.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListConcepto_Estado_de_ResultadoComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Concepto_Estado_de_ResultadoComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Concepto_Estado_de_ResultadoComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Concepto_Estado_de_ResultadoComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterConcepto_Estado_de_ResultadoComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Concepto_Estado_de_ResultadoRoutingModule {
 }

