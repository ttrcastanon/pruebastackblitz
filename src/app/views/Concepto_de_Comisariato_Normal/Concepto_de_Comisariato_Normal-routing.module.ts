import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Concepto_de_Comisariato_NormalComponent } from './Concepto_de_Comisariato_Normal-add-edit/Concepto_de_Comisariato_Normal.component';
import { ListConcepto_de_Comisariato_NormalComponent } from './list-Concepto_de_Comisariato_Normal/list-Concepto_de_Comisariato_Normal.component';
import { ShowAdvanceFilterConcepto_de_Comisariato_NormalComponent } from './show-advance-filter-Concepto_de_Comisariato_Normal/show-advance-filter-Concepto_de_Comisariato_Normal.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListConcepto_de_Comisariato_NormalComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Concepto_de_Comisariato_NormalComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Concepto_de_Comisariato_NormalComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Concepto_de_Comisariato_NormalComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterConcepto_de_Comisariato_NormalComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Concepto_de_Comisariato_NormalRoutingModule {
 }

