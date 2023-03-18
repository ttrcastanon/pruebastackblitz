import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Creacion_de_ClientesComponent } from './Creacion_de_Clientes-add-edit/Creacion_de_Clientes.component';
import { ListCreacion_de_ClientesComponent } from './list-Creacion_de_Clientes/list-Creacion_de_Clientes.component';
import { ShowAdvanceFilterCreacion_de_ClientesComponent } from './show-advance-filter-Creacion_de_Clientes/show-advance-filter-Creacion_de_Clientes.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListCreacion_de_ClientesComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Creacion_de_ClientesComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Creacion_de_ClientesComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Creacion_de_ClientesComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterCreacion_de_ClientesComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Creacion_de_ClientesRoutingModule {
 }

