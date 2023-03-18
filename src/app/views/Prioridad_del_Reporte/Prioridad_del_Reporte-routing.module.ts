import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Prioridad_del_ReporteComponent } from './Prioridad_del_Reporte-add-edit/Prioridad_del_Reporte.component';
import { ListPrioridad_del_ReporteComponent } from './list-Prioridad_del_Reporte/list-Prioridad_del_Reporte.component';
import { ShowAdvanceFilterPrioridad_del_ReporteComponent } from './show-advance-filter-Prioridad_del_Reporte/show-advance-filter-Prioridad_del_Reporte.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListPrioridad_del_ReporteComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Prioridad_del_ReporteComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Prioridad_del_ReporteComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Prioridad_del_ReporteComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterPrioridad_del_ReporteComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Prioridad_del_ReporteRoutingModule {
 }

