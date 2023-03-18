import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { EstadoComponent } from './Estado-add-edit/Estado.component';
import { ListEstadoComponent } from './list-Estado/list-Estado.component';
import { ShowAdvanceFilterEstadoComponent } from './show-advance-filter-Estado/show-advance-filter-Estado.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListEstadoComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: EstadoComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: EstadoComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: EstadoComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterEstadoComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class EstadoRoutingModule {
 }

