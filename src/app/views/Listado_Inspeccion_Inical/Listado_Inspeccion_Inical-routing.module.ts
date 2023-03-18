import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Listado_Inspeccion_InicalComponent } from './Listado_Inspeccion_Inical-add-edit/Listado_Inspeccion_Inical.component';
import { ListListado_Inspeccion_InicalComponent } from './list-Listado_Inspeccion_Inical/list-Listado_Inspeccion_Inical.component';
import { ShowAdvanceFilterListado_Inspeccion_InicalComponent } from './show-advance-filter-Listado_Inspeccion_Inical/show-advance-filter-Listado_Inspeccion_Inical.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListListado_Inspeccion_InicalComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Listado_Inspeccion_InicalComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Listado_Inspeccion_InicalComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Listado_Inspeccion_InicalComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterListado_Inspeccion_InicalComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Listado_Inspeccion_InicalRoutingModule {
 }

