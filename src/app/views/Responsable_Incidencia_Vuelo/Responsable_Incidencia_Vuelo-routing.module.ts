import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Responsable_Incidencia_VueloComponent } from './Responsable_Incidencia_Vuelo-add-edit/Responsable_Incidencia_Vuelo.component';
import { ListResponsable_Incidencia_VueloComponent } from './list-Responsable_Incidencia_Vuelo/list-Responsable_Incidencia_Vuelo.component';
import { ShowAdvanceFilterResponsable_Incidencia_VueloComponent } from './show-advance-filter-Responsable_Incidencia_Vuelo/show-advance-filter-Responsable_Incidencia_Vuelo.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListResponsable_Incidencia_VueloComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Responsable_Incidencia_VueloComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Responsable_Incidencia_VueloComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Responsable_Incidencia_VueloComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterResponsable_Incidencia_VueloComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Responsable_Incidencia_VueloRoutingModule {
 }

