import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Tipo_Incidencia_VuelosComponent } from './Tipo_Incidencia_Vuelos-add-edit/Tipo_Incidencia_Vuelos.component';
import { ListTipo_Incidencia_VuelosComponent } from './list-Tipo_Incidencia_Vuelos/list-Tipo_Incidencia_Vuelos.component';
import { ShowAdvanceFilterTipo_Incidencia_VuelosComponent } from './show-advance-filter-Tipo_Incidencia_Vuelos/show-advance-filter-Tipo_Incidencia_Vuelos.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListTipo_Incidencia_VuelosComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Tipo_Incidencia_VuelosComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Tipo_Incidencia_VuelosComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Tipo_Incidencia_VuelosComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterTipo_Incidencia_VuelosComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Tipo_Incidencia_VuelosRoutingModule {
 }

