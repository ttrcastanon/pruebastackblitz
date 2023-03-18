import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Creacion_de_UsuariosComponent } from './Creacion_de_Usuarios-add-edit/Creacion_de_Usuarios.component';
import { ListCreacion_de_UsuariosComponent } from './list-Creacion_de_Usuarios/list-Creacion_de_Usuarios.component';
import { ShowAdvanceFilterCreacion_de_UsuariosComponent } from './show-advance-filter-Creacion_de_Usuarios/show-advance-filter-Creacion_de_Usuarios.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListCreacion_de_UsuariosComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Creacion_de_UsuariosComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Creacion_de_UsuariosComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Creacion_de_UsuariosComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterCreacion_de_UsuariosComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Creacion_de_UsuariosRoutingModule {
 }

