import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Tipo_de_SeguroComponent } from './Tipo_de_Seguro-add-edit/Tipo_de_Seguro.component';
import { ListTipo_de_SeguroComponent } from './list-Tipo_de_Seguro/list-Tipo_de_Seguro.component';
import { ShowAdvanceFilterTipo_de_SeguroComponent } from './show-advance-filter-Tipo_de_Seguro/show-advance-filter-Tipo_de_Seguro.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListTipo_de_SeguroComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Tipo_de_SeguroComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Tipo_de_SeguroComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Tipo_de_SeguroComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterTipo_de_SeguroComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Tipo_de_SeguroRoutingModule {
 }

