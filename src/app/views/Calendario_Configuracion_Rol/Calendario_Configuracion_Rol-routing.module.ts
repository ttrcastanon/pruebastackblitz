import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Calendario_Configuracion_RolComponent } from './Calendario_Configuracion_Rol-add-edit/Calendario_Configuracion_Rol.component';
import { ListCalendario_Configuracion_RolComponent } from './list-Calendario_Configuracion_Rol/list-Calendario_Configuracion_Rol.component';
import { ShowAdvanceFilterCalendario_Configuracion_RolComponent } from './show-advance-filter-Calendario_Configuracion_Rol/show-advance-filter-Calendario_Configuracion_Rol.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListCalendario_Configuracion_RolComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Calendario_Configuracion_RolComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Calendario_Configuracion_RolComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Calendario_Configuracion_RolComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterCalendario_Configuracion_RolComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Calendario_Configuracion_RolRoutingModule {
 }

