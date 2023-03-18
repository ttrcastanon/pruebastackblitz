import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Agrupacion_Concepto_Balance_GeneralComponent } from './Agrupacion_Concepto_Balance_General-add-edit/Agrupacion_Concepto_Balance_General.component';
import { ListAgrupacion_Concepto_Balance_GeneralComponent } from './list-Agrupacion_Concepto_Balance_General/list-Agrupacion_Concepto_Balance_General.component';
import { ShowAdvanceFilterAgrupacion_Concepto_Balance_GeneralComponent } from './show-advance-filter-Agrupacion_Concepto_Balance_General/show-advance-filter-Agrupacion_Concepto_Balance_General.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListAgrupacion_Concepto_Balance_GeneralComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Agrupacion_Concepto_Balance_GeneralComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Agrupacion_Concepto_Balance_GeneralComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Agrupacion_Concepto_Balance_GeneralComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterAgrupacion_Concepto_Balance_GeneralComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Agrupacion_Concepto_Balance_GeneralRoutingModule {
 }

