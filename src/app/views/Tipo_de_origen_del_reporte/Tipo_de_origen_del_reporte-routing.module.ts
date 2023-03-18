import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Tipo_de_origen_del_reporteComponent } from './Tipo_de_origen_del_reporte-add-edit/Tipo_de_origen_del_reporte.component';
import { ListTipo_de_origen_del_reporteComponent } from './list-Tipo_de_origen_del_reporte/list-Tipo_de_origen_del_reporte.component';
import { ShowAdvanceFilterTipo_de_origen_del_reporteComponent } from './show-advance-filter-Tipo_de_origen_del_reporte/show-advance-filter-Tipo_de_origen_del_reporte.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListTipo_de_origen_del_reporteComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Tipo_de_origen_del_reporteComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Tipo_de_origen_del_reporteComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Tipo_de_origen_del_reporteComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterTipo_de_origen_del_reporteComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Tipo_de_origen_del_reporteRoutingModule {
 }

