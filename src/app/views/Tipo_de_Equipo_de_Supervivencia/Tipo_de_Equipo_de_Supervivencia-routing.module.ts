import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Tipo_de_Equipo_de_SupervivenciaComponent } from './Tipo_de_Equipo_de_Supervivencia-add-edit/Tipo_de_Equipo_de_Supervivencia.component';
import { ListTipo_de_Equipo_de_SupervivenciaComponent } from './list-Tipo_de_Equipo_de_Supervivencia/list-Tipo_de_Equipo_de_Supervivencia.component';
import { ShowAdvanceFilterTipo_de_Equipo_de_SupervivenciaComponent } from './show-advance-filter-Tipo_de_Equipo_de_Supervivencia/show-advance-filter-Tipo_de_Equipo_de_Supervivencia.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListTipo_de_Equipo_de_SupervivenciaComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Tipo_de_Equipo_de_SupervivenciaComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Tipo_de_Equipo_de_SupervivenciaComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Tipo_de_Equipo_de_SupervivenciaComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterTipo_de_Equipo_de_SupervivenciaComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Tipo_de_Equipo_de_SupervivenciaRoutingModule {
 }

