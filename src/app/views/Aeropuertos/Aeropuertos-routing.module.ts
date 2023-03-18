import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { AeropuertosComponent } from './Aeropuertos-add-edit/Aeropuertos.component';
import { ListAeropuertosComponent } from './list-Aeropuertos/list-Aeropuertos.component';
import { ShowAdvanceFilterAeropuertosComponent } from './show-advance-filter-Aeropuertos/show-advance-filter-Aeropuertos.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListAeropuertosComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: AeropuertosComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: AeropuertosComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: AeropuertosComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterAeropuertosComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class AeropuertosRoutingModule {
 }

