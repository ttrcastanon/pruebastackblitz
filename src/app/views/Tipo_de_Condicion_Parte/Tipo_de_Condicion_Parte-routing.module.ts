import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Tipo_de_Condicion_ParteComponent } from './Tipo_de_Condicion_Parte-add-edit/Tipo_de_Condicion_Parte.component';
import { ListTipo_de_Condicion_ParteComponent } from './list-Tipo_de_Condicion_Parte/list-Tipo_de_Condicion_Parte.component';
import { ShowAdvanceFilterTipo_de_Condicion_ParteComponent } from './show-advance-filter-Tipo_de_Condicion_Parte/show-advance-filter-Tipo_de_Condicion_Parte.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListTipo_de_Condicion_ParteComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Tipo_de_Condicion_ParteComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Tipo_de_Condicion_ParteComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Tipo_de_Condicion_ParteComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterTipo_de_Condicion_ParteComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Tipo_de_Condicion_ParteRoutingModule {
 }

