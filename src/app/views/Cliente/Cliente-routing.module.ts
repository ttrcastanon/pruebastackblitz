import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { ClienteComponent } from './Cliente-add-edit/Cliente.component';
import { ListClienteComponent } from './list-Cliente/list-Cliente.component';
import { ShowAdvanceFilterClienteComponent } from './show-advance-filter-Cliente/show-advance-filter-Cliente.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListClienteComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: ClienteComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: ClienteComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: ClienteComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterClienteComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class ClienteRoutingModule {
 }

