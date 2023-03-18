import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Actividades_de_los_ColaboradoresComponent } from './Actividades_de_los_Colaboradores-add-edit/Actividades_de_los_Colaboradores.component';
import { ListActividades_de_los_ColaboradoresComponent } from './list-Actividades_de_los_Colaboradores/list-Actividades_de_los_Colaboradores.component';
import { ShowAdvanceFilterActividades_de_los_ColaboradoresComponent } from './show-advance-filter-Actividades_de_los_Colaboradores/show-advance-filter-Actividades_de_los_Colaboradores.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListActividades_de_los_ColaboradoresComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Actividades_de_los_ColaboradoresComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Actividades_de_los_ColaboradoresComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Actividades_de_los_ColaboradoresComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterActividades_de_los_ColaboradoresComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Actividades_de_los_ColaboradoresRoutingModule {
 }

