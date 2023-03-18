import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { MotoresComponent } from './Motores-add-edit/Motores.component';
import { ListMotoresComponent } from './list-Motores/list-Motores.component';
import { ShowAdvanceFilterMotoresComponent } from './show-advance-filter-Motores/show-advance-filter-Motores.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListMotoresComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: MotoresComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: MotoresComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: MotoresComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterMotoresComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class MotoresRoutingModule {
 }

