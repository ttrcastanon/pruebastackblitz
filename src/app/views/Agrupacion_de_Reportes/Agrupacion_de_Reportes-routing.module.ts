import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Agrupacion_de_ReportesComponent } from './Agrupacion_de_Reportes-add-edit/Agrupacion_de_Reportes.component';
import { ListAgrupacion_de_ReportesComponent } from './list-Agrupacion_de_Reportes/list-Agrupacion_de_Reportes.component';
import { ShowAdvanceFilterAgrupacion_de_ReportesComponent } from './show-advance-filter-Agrupacion_de_Reportes/show-advance-filter-Agrupacion_de_Reportes.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListAgrupacion_de_ReportesComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Agrupacion_de_ReportesComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Agrupacion_de_ReportesComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Agrupacion_de_ReportesComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterAgrupacion_de_ReportesComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Agrupacion_de_ReportesRoutingModule {
 }

