import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Concepto_de_Gasto_de_AeronaveComponent } from './Concepto_de_Gasto_de_Aeronave-add-edit/Concepto_de_Gasto_de_Aeronave.component';
import { ListConcepto_de_Gasto_de_AeronaveComponent } from './list-Concepto_de_Gasto_de_Aeronave/list-Concepto_de_Gasto_de_Aeronave.component';
import { ShowAdvanceFilterConcepto_de_Gasto_de_AeronaveComponent } from './show-advance-filter-Concepto_de_Gasto_de_Aeronave/show-advance-filter-Concepto_de_Gasto_de_Aeronave.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListConcepto_de_Gasto_de_AeronaveComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Concepto_de_Gasto_de_AeronaveComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Concepto_de_Gasto_de_AeronaveComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Concepto_de_Gasto_de_AeronaveComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterConcepto_de_Gasto_de_AeronaveComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Concepto_de_Gasto_de_AeronaveRoutingModule {
 }

