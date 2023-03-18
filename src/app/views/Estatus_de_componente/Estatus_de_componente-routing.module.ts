import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Estatus_de_componenteComponent } from './Estatus_de_componente-add-edit/Estatus_de_componente.component';
import { ListEstatus_de_componenteComponent } from './list-Estatus_de_componente/list-Estatus_de_componente.component';
import { ShowAdvanceFilterEstatus_de_componenteComponent } from './show-advance-filter-Estatus_de_componente/show-advance-filter-Estatus_de_componente.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListEstatus_de_componenteComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Estatus_de_componenteComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Estatus_de_componenteComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Estatus_de_componenteComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterEstatus_de_componenteComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Estatus_de_componenteRoutingModule {
 }

