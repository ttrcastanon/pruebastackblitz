import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Estatus_de_remocionComponent } from './Estatus_de_remocion-add-edit/Estatus_de_remocion.component';
import { ListEstatus_de_remocionComponent } from './list-Estatus_de_remocion/list-Estatus_de_remocion.component';
import { ShowAdvanceFilterEstatus_de_remocionComponent } from './show-advance-filter-Estatus_de_remocion/show-advance-filter-Estatus_de_remocion.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListEstatus_de_remocionComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Estatus_de_remocionComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Estatus_de_remocionComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Estatus_de_remocionComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterEstatus_de_remocionComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Estatus_de_remocionRoutingModule {
 }

