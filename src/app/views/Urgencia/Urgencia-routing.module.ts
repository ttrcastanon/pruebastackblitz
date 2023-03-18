import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { UrgenciaComponent } from './Urgencia-add-edit/Urgencia.component';
import { ListUrgenciaComponent } from './list-Urgencia/list-Urgencia.component';
import { ShowAdvanceFilterUrgenciaComponent } from './show-advance-filter-Urgencia/show-advance-filter-Urgencia.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListUrgenciaComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: UrgenciaComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: UrgenciaComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: UrgenciaComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterUrgenciaComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class UrgenciaRoutingModule {
 }

