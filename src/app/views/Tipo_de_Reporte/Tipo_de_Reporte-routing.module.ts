import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Tipo_de_ReporteComponent } from './Tipo_de_Reporte-add-edit/Tipo_de_Reporte.component';
import { ListTipo_de_ReporteComponent } from './list-Tipo_de_Reporte/list-Tipo_de_Reporte.component';
import { ShowAdvanceFilterTipo_de_ReporteComponent } from './show-advance-filter-Tipo_de_Reporte/show-advance-filter-Tipo_de_Reporte.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListTipo_de_ReporteComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Tipo_de_ReporteComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Tipo_de_ReporteComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Tipo_de_ReporteComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterTipo_de_ReporteComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Tipo_de_ReporteRoutingModule {
 }

