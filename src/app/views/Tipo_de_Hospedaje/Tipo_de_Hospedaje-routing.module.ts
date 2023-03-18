import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Tipo_de_HospedajeComponent } from './Tipo_de_Hospedaje-add-edit/Tipo_de_Hospedaje.component';
import { ListTipo_de_HospedajeComponent } from './list-Tipo_de_Hospedaje/list-Tipo_de_Hospedaje.component';
import { ShowAdvanceFilterTipo_de_HospedajeComponent } from './show-advance-filter-Tipo_de_Hospedaje/show-advance-filter-Tipo_de_Hospedaje.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListTipo_de_HospedajeComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Tipo_de_HospedajeComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Tipo_de_HospedajeComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Tipo_de_HospedajeComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterTipo_de_HospedajeComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Tipo_de_HospedajeRoutingModule {
 }

