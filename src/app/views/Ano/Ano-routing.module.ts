import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { AnoComponent } from './Ano-add-edit/Ano.component';
import { ListAnoComponent } from './list-Ano/list-Ano.component';
import { ShowAdvanceFilterAnoComponent } from './show-advance-filter-Ano/show-advance-filter-Ano.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListAnoComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: AnoComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: AnoComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: AnoComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterAnoComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class AnoRoutingModule {
 }

