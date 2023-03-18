import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Ingreso_de_Costos_de_ServiciosComponent } from './Ingreso_de_Costos_de_Servicios-add-edit/Ingreso_de_Costos_de_Servicios.component';
import { ListIngreso_de_Costos_de_ServiciosComponent } from './list-Ingreso_de_Costos_de_Servicios/list-Ingreso_de_Costos_de_Servicios.component';
import { ShowAdvanceFilterIngreso_de_Costos_de_ServiciosComponent } from './show-advance-filter-Ingreso_de_Costos_de_Servicios/show-advance-filter-Ingreso_de_Costos_de_Servicios.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListIngreso_de_Costos_de_ServiciosComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Ingreso_de_Costos_de_ServiciosComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Ingreso_de_Costos_de_ServiciosComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Ingreso_de_Costos_de_ServiciosComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterIngreso_de_Costos_de_ServiciosComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Ingreso_de_Costos_de_ServiciosRoutingModule {
 }

