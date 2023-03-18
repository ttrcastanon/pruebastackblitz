import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { CiudadComponent } from './Ciudad-add-edit/Ciudad.component';
import { ListCiudadComponent } from './list-Ciudad/list-Ciudad.component';
import { ShowAdvanceFilterCiudadComponent } from './show-advance-filter-Ciudad/show-advance-filter-Ciudad.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListCiudadComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: CiudadComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: CiudadComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: CiudadComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterCiudadComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class CiudadRoutingModule {
 }

