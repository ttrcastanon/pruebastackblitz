import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Tipo_de_ClienteComponent } from './Tipo_de_Cliente-add-edit/Tipo_de_Cliente.component';
import { ListTipo_de_ClienteComponent } from './list-Tipo_de_Cliente/list-Tipo_de_Cliente.component';
import { ShowAdvanceFilterTipo_de_ClienteComponent } from './show-advance-filter-Tipo_de_Cliente/show-advance-filter-Tipo_de_Cliente.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListTipo_de_ClienteComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Tipo_de_ClienteComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Tipo_de_ClienteComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Tipo_de_ClienteComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterTipo_de_ClienteComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Tipo_de_ClienteRoutingModule {
 }

