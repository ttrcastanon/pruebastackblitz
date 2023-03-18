import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Registro_de_vueloComponent } from './Registro_de_vuelo-add-edit/Registro_de_vuelo.component';
import { ListRegistro_de_vueloComponent } from './list-Registro_de_vuelo/list-Registro_de_vuelo.component';
import { ShowAdvanceFilterRegistro_de_vueloComponent } from './show-advance-filter-Registro_de_vuelo/show-advance-filter-Registro_de_vuelo.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListRegistro_de_vueloComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Registro_de_vueloComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Registro_de_vueloComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Registro_de_vueloComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterRegistro_de_vueloComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Registro_de_vueloRoutingModule {
 }

