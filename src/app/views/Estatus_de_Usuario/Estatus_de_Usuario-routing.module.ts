import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Estatus_de_UsuarioComponent } from './Estatus_de_Usuario-add-edit/Estatus_de_Usuario.component';
import { ListEstatus_de_UsuarioComponent } from './list-Estatus_de_Usuario/list-Estatus_de_Usuario.component';
import { ShowAdvanceFilterEstatus_de_UsuarioComponent } from './show-advance-filter-Estatus_de_Usuario/show-advance-filter-Estatus_de_Usuario.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListEstatus_de_UsuarioComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Estatus_de_UsuarioComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Estatus_de_UsuarioComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Estatus_de_UsuarioComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterEstatus_de_UsuarioComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Estatus_de_UsuarioRoutingModule {
 }

