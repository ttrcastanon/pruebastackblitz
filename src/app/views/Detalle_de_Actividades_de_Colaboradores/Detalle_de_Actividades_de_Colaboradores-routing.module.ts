import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Detalle_de_Actividades_de_ColaboradoresComponent } from './Detalle_de_Actividades_de_Colaboradores-add-edit/Detalle_de_Actividades_de_Colaboradores.component';
import { ListDetalle_de_Actividades_de_ColaboradoresComponent } from './list-Detalle_de_Actividades_de_Colaboradores/list-Detalle_de_Actividades_de_Colaboradores.component';
import { ShowAdvanceFilterDetalle_de_Actividades_de_ColaboradoresComponent } from './show-advance-filter-Detalle_de_Actividades_de_Colaboradores/show-advance-filter-Detalle_de_Actividades_de_Colaboradores.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListDetalle_de_Actividades_de_ColaboradoresComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Detalle_de_Actividades_de_ColaboradoresComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Detalle_de_Actividades_de_ColaboradoresComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Detalle_de_Actividades_de_ColaboradoresComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterDetalle_de_Actividades_de_ColaboradoresComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Detalle_de_Actividades_de_ColaboradoresRoutingModule {
 }

