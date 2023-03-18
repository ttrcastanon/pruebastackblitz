import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Concepto_Balance_GeneralComponent } from './Concepto_Balance_General-add-edit/Concepto_Balance_General.component';
import { ListConcepto_Balance_GeneralComponent } from './list-Concepto_Balance_General/list-Concepto_Balance_General.component';
import { ShowAdvanceFilterConcepto_Balance_GeneralComponent } from './show-advance-filter-Concepto_Balance_General/show-advance-filter-Concepto_Balance_General.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListConcepto_Balance_GeneralComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Concepto_Balance_GeneralComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Concepto_Balance_GeneralComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Concepto_Balance_GeneralComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterConcepto_Balance_GeneralComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Concepto_Balance_GeneralRoutingModule {
 }

