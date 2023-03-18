import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Existencia_solicitud_crear_reporteComponent } from './Existencia_solicitud_crear_reporte-add-edit/Existencia_solicitud_crear_reporte.component';
import { ListExistencia_solicitud_crear_reporteComponent } from './list-Existencia_solicitud_crear_reporte/list-Existencia_solicitud_crear_reporte.component';
import { ShowAdvanceFilterExistencia_solicitud_crear_reporteComponent } from './show-advance-filter-Existencia_solicitud_crear_reporte/show-advance-filter-Existencia_solicitud_crear_reporte.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListExistencia_solicitud_crear_reporteComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Existencia_solicitud_crear_reporteComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Existencia_solicitud_crear_reporteComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Existencia_solicitud_crear_reporteComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterExistencia_solicitud_crear_reporteComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Existencia_solicitud_crear_reporteRoutingModule {
 }

