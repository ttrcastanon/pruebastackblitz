import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Estatus_ReporteComponent } from './Estatus_Reporte-add-edit/Estatus_Reporte.component';
import { ListEstatus_ReporteComponent } from './list-Estatus_Reporte/list-Estatus_Reporte.component';
import { ShowAdvanceFilterEstatus_ReporteComponent } from './show-advance-filter-Estatus_Reporte/show-advance-filter-Estatus_Reporte.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListEstatus_ReporteComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Estatus_ReporteComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Estatus_ReporteComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Estatus_ReporteComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterEstatus_ReporteComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Estatus_ReporteRoutingModule {
 }

