import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Gastos_de_VueloComponent } from './Gastos_de_Vuelo-add-edit/Gastos_de_Vuelo.component';
import { ListGastos_de_VueloComponent } from './list-Gastos_de_Vuelo/list-Gastos_de_Vuelo.component';
import { ShowAdvanceFilterGastos_de_VueloComponent } from './show-advance-filter-Gastos_de_Vuelo/show-advance-filter-Gastos_de_Vuelo.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListGastos_de_VueloComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Gastos_de_VueloComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Gastos_de_VueloComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Gastos_de_VueloComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterGastos_de_VueloComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Gastos_de_VueloRoutingModule {
 }

