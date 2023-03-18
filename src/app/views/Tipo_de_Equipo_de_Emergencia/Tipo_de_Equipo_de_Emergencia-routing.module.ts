import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Tipo_de_Equipo_de_EmergenciaComponent } from './Tipo_de_Equipo_de_Emergencia-add-edit/Tipo_de_Equipo_de_Emergencia.component';
import { ListTipo_de_Equipo_de_EmergenciaComponent } from './list-Tipo_de_Equipo_de_Emergencia/list-Tipo_de_Equipo_de_Emergencia.component';
import { ShowAdvanceFilterTipo_de_Equipo_de_EmergenciaComponent } from './show-advance-filter-Tipo_de_Equipo_de_Emergencia/show-advance-filter-Tipo_de_Equipo_de_Emergencia.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListTipo_de_Equipo_de_EmergenciaComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Tipo_de_Equipo_de_EmergenciaComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Tipo_de_Equipo_de_EmergenciaComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Tipo_de_Equipo_de_EmergenciaComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterTipo_de_Equipo_de_EmergenciaComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Tipo_de_Equipo_de_EmergenciaRoutingModule {
 }

