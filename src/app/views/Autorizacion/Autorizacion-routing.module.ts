import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { AutorizacionComponent } from './Autorizacion-add-edit/Autorizacion.component';
import { ListAutorizacionComponent } from './list-Autorizacion/list-Autorizacion.component';
import { ShowAdvanceFilterAutorizacionComponent } from './show-advance-filter-Autorizacion/show-advance-filter-Autorizacion.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListAutorizacionComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: AutorizacionComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: AutorizacionComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: AutorizacionComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterAutorizacionComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class AutorizacionRoutingModule {
 }

