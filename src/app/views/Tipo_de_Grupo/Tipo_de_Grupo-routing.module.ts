import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Tipo_de_GrupoComponent } from './Tipo_de_Grupo-add-edit/Tipo_de_Grupo.component';
import { ListTipo_de_GrupoComponent } from './list-Tipo_de_Grupo/list-Tipo_de_Grupo.component';
import { ShowAdvanceFilterTipo_de_GrupoComponent } from './show-advance-filter-Tipo_de_Grupo/show-advance-filter-Tipo_de_Grupo.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListTipo_de_GrupoComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Tipo_de_GrupoComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Tipo_de_GrupoComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Tipo_de_GrupoComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterTipo_de_GrupoComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Tipo_de_GrupoRoutingModule {
 }

