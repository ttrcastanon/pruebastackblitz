import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Listado_de_Vuelo_a_FacturarComponent } from './Listado_de_Vuelo_a_Facturar-add-edit/Listado_de_Vuelo_a_Facturar.component';
import { ListListado_de_Vuelo_a_FacturarComponent } from './list-Listado_de_Vuelo_a_Facturar/list-Listado_de_Vuelo_a_Facturar.component';
import { ShowAdvanceFilterListado_de_Vuelo_a_FacturarComponent } from './show-advance-filter-Listado_de_Vuelo_a_Facturar/show-advance-filter-Listado_de_Vuelo_a_Facturar.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListListado_de_Vuelo_a_FacturarComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Listado_de_Vuelo_a_FacturarComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Listado_de_Vuelo_a_FacturarComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Listado_de_Vuelo_a_FacturarComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterListado_de_Vuelo_a_FacturarComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Listado_de_Vuelo_a_FacturarRoutingModule {
 }

