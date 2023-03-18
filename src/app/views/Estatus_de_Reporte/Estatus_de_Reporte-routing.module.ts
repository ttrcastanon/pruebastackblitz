import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Estatus_de_ReporteComponent } from './Estatus_de_Reporte-add-edit/Estatus_de_Reporte.component';
import { ListEstatus_de_ReporteComponent } from './list-Estatus_de_Reporte/list-Estatus_de_Reporte.component';
import { ShowAdvanceFilterEstatus_de_ReporteComponent } from './show-advance-filter-Estatus_de_Reporte/show-advance-filter-Estatus_de_Reporte.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListEstatus_de_ReporteComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Estatus_de_ReporteComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Estatus_de_ReporteComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Estatus_de_ReporteComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterEstatus_de_ReporteComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Estatus_de_ReporteRoutingModule {
 }

