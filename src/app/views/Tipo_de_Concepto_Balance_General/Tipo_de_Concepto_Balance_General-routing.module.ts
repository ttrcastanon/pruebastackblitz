import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Tipo_de_Concepto_Balance_GeneralComponent } from './Tipo_de_Concepto_Balance_General-add-edit/Tipo_de_Concepto_Balance_General.component';
import { ListTipo_de_Concepto_Balance_GeneralComponent } from './list-Tipo_de_Concepto_Balance_General/list-Tipo_de_Concepto_Balance_General.component';
import { ShowAdvanceFilterTipo_de_Concepto_Balance_GeneralComponent } from './show-advance-filter-Tipo_de_Concepto_Balance_General/show-advance-filter-Tipo_de_Concepto_Balance_General.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListTipo_de_Concepto_Balance_GeneralComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Tipo_de_Concepto_Balance_GeneralComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Tipo_de_Concepto_Balance_GeneralComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Tipo_de_Concepto_Balance_GeneralComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterTipo_de_Concepto_Balance_GeneralComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Tipo_de_Concepto_Balance_GeneralRoutingModule {
 }

