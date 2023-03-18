import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from '../../shared/services/auth-guard.service';
import { Crear_ReporteComponent } from './Crear_Reporte-add-edit/Crear_Reporte.component';
import { ListCrear_ReporteComponent } from './list-Crear_Reporte/list-Crear_Reporte.component';
import { ShowAdvanceFilterCrear_ReporteComponent } from './show-advance-filter-Crear_Reporte/show-advance-filter-Crear_Reporte.component';


const routes: Routes = [
  {
    path: 'list',
    component: ListCrear_ReporteComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'list/:id',
    component: ListCrear_ReporteComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Crear_ReporteComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Crear_ReporteComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Crear_ReporteComponent,
    canActivate: [AuthGuardService],
    data: { readOnly: true }
  },
  {
    path: 'showadvancefilter',
    component: ShowAdvanceFilterCrear_ReporteComponent,
    canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Crear_ReporteRoutingModule {
}

