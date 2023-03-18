import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Tipos_de_Modelo_CursoComponent } from './Tipos_de_Modelo_Curso-add-edit/Tipos_de_Modelo_Curso.component';
import { ListTipos_de_Modelo_CursoComponent } from './list-Tipos_de_Modelo_Curso/list-Tipos_de_Modelo_Curso.component';
import { ShowAdvanceFilterTipos_de_Modelo_CursoComponent } from './show-advance-filter-Tipos_de_Modelo_Curso/show-advance-filter-Tipos_de_Modelo_Curso.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListTipos_de_Modelo_CursoComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Tipos_de_Modelo_CursoComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Tipos_de_Modelo_CursoComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Tipos_de_Modelo_CursoComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterTipos_de_Modelo_CursoComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Tipos_de_Modelo_CursoRoutingModule {
 }

