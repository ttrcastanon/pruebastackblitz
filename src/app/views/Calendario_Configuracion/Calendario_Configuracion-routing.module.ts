import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Calendario_ConfiguracionComponent } from './Calendario_Configuracion-add-edit/Calendario_Configuracion.component';
import { ListCalendario_ConfiguracionComponent } from './list-Calendario_Configuracion/list-Calendario_Configuracion.component';
import { ShowAdvanceFilterCalendario_ConfiguracionComponent } from './show-advance-filter-Calendario_Configuracion/show-advance-filter-Calendario_Configuracion.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListCalendario_ConfiguracionComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Calendario_ConfiguracionComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Calendario_ConfiguracionComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Calendario_ConfiguracionComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterCalendario_ConfiguracionComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Calendario_ConfiguracionRoutingModule {
 }

