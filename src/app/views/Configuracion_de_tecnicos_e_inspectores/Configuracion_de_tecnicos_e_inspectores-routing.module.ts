import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Configuracion_de_tecnicos_e_inspectoresComponent } from './Configuracion_de_tecnicos_e_inspectores-add-edit/Configuracion_de_tecnicos_e_inspectores.component';
import { ListConfiguracion_de_tecnicos_e_inspectoresComponent } from './list-Configuracion_de_tecnicos_e_inspectores/list-Configuracion_de_tecnicos_e_inspectores.component';
import { ShowAdvanceFilterConfiguracion_de_tecnicos_e_inspectoresComponent } from './show-advance-filter-Configuracion_de_tecnicos_e_inspectores/show-advance-filter-Configuracion_de_tecnicos_e_inspectores.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListConfiguracion_de_tecnicos_e_inspectoresComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Configuracion_de_tecnicos_e_inspectoresComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Configuracion_de_tecnicos_e_inspectoresComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Configuracion_de_tecnicos_e_inspectoresComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterConfiguracion_de_tecnicos_e_inspectoresComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Configuracion_de_tecnicos_e_inspectoresRoutingModule {
 }

