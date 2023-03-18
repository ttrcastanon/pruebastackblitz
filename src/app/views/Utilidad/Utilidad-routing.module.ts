import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { UtilidadComponent } from './Utilidad-add-edit/Utilidad.component';
import { ListUtilidadComponent } from './list-Utilidad/list-Utilidad.component';
import { ShowAdvanceFilterUtilidadComponent } from './show-advance-filter-Utilidad/show-advance-filter-Utilidad.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListUtilidadComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: UtilidadComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: UtilidadComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: UtilidadComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterUtilidadComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class UtilidadRoutingModule {
 }

