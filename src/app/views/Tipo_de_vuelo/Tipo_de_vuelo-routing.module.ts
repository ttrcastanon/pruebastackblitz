import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Tipo_de_vueloComponent } from './Tipo_de_vuelo-add-edit/Tipo_de_vuelo.component';
import { ListTipo_de_vueloComponent } from './list-Tipo_de_vuelo/list-Tipo_de_vuelo.component';
import { ShowAdvanceFilterTipo_de_vueloComponent } from './show-advance-filter-Tipo_de_vuelo/show-advance-filter-Tipo_de_vuelo.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListTipo_de_vueloComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Tipo_de_vueloComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Tipo_de_vueloComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Tipo_de_vueloComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterTipo_de_vueloComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Tipo_de_vueloRoutingModule {
 }

