import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Modulos_reportesComponent } from './Modulos_reportes-add-edit/Modulos_reportes.component';
import { ListModulos_reportesComponent } from './list-Modulos_reportes/list-Modulos_reportes.component';
import { ShowAdvanceFilterModulos_reportesComponent } from './show-advance-filter-Modulos_reportes/show-advance-filter-Modulos_reportes.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListModulos_reportesComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Modulos_reportesComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Modulos_reportesComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Modulos_reportesComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterModulos_reportesComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Modulos_reportesRoutingModule {
 }

