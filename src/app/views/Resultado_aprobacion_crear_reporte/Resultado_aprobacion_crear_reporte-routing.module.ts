import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Resultado_aprobacion_crear_reporteComponent } from './Resultado_aprobacion_crear_reporte-add-edit/Resultado_aprobacion_crear_reporte.component';
import { ListResultado_aprobacion_crear_reporteComponent } from './list-Resultado_aprobacion_crear_reporte/list-Resultado_aprobacion_crear_reporte.component';
import { ShowAdvanceFilterResultado_aprobacion_crear_reporteComponent } from './show-advance-filter-Resultado_aprobacion_crear_reporte/show-advance-filter-Resultado_aprobacion_crear_reporte.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListResultado_aprobacion_crear_reporteComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Resultado_aprobacion_crear_reporteComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Resultado_aprobacion_crear_reporteComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Resultado_aprobacion_crear_reporteComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterResultado_aprobacion_crear_reporteComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Resultado_aprobacion_crear_reporteRoutingModule {
 }

