import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Equipo_de_NavegacionComponent } from './Equipo_de_Navegacion-add-edit/Equipo_de_Navegacion.component';
import { ListEquipo_de_NavegacionComponent } from './list-Equipo_de_Navegacion/list-Equipo_de_Navegacion.component';
import { ShowAdvanceFilterEquipo_de_NavegacionComponent } from './show-advance-filter-Equipo_de_Navegacion/show-advance-filter-Equipo_de_Navegacion.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListEquipo_de_NavegacionComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Equipo_de_NavegacionComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Equipo_de_NavegacionComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Equipo_de_NavegacionComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterEquipo_de_NavegacionComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Equipo_de_NavegacionRoutingModule {
 }

