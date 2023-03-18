import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Catalogo_ReportesComponent } from './Catalogo_Reportes-add-edit/Catalogo_Reportes.component';
import { ListCatalogo_ReportesComponent } from './list-Catalogo_Reportes/list-Catalogo_Reportes.component';
import { ShowAdvanceFilterCatalogo_ReportesComponent } from './show-advance-filter-Catalogo_Reportes/show-advance-filter-Catalogo_Reportes.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListCatalogo_ReportesComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Catalogo_ReportesComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Catalogo_ReportesComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Catalogo_ReportesComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterCatalogo_ReportesComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Catalogo_ReportesRoutingModule {
 }

