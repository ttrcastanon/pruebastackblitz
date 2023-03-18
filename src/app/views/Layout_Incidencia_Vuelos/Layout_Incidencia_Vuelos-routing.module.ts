import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Layout_Incidencia_VuelosComponent } from './Layout_Incidencia_Vuelos-add-edit/Layout_Incidencia_Vuelos.component';
import { ListLayout_Incidencia_VuelosComponent } from './list-Layout_Incidencia_Vuelos/list-Layout_Incidencia_Vuelos.component';
import { ShowAdvanceFilterLayout_Incidencia_VuelosComponent } from './show-advance-filter-Layout_Incidencia_Vuelos/show-advance-filter-Layout_Incidencia_Vuelos.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListLayout_Incidencia_VuelosComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Layout_Incidencia_VuelosComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Layout_Incidencia_VuelosComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Layout_Incidencia_VuelosComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterLayout_Incidencia_VuelosComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Layout_Incidencia_VuelosRoutingModule {
 }

