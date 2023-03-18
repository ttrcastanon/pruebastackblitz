import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Filtros_de_reportesComponent } from './Filtros_de_reportes-add-edit/Filtros_de_reportes.component';
import { ListFiltros_de_reportesComponent } from './list-Filtros_de_reportes/list-Filtros_de_reportes.component';
import { ShowAdvanceFilterFiltros_de_reportesComponent } from './show-advance-filter-Filtros_de_reportes/show-advance-filter-Filtros_de_reportes.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListFiltros_de_reportesComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Filtros_de_reportesComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Filtros_de_reportesComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Filtros_de_reportesComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterFiltros_de_reportesComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Filtros_de_reportesRoutingModule {
 }

