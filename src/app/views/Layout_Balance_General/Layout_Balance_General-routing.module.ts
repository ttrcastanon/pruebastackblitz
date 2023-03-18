import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Layout_Balance_GeneralComponent } from './Layout_Balance_General-add-edit/Layout_Balance_General.component';
import { ListLayout_Balance_GeneralComponent } from './list-Layout_Balance_General/list-Layout_Balance_General.component';
import { ShowAdvanceFilterLayout_Balance_GeneralComponent } from './show-advance-filter-Layout_Balance_General/show-advance-filter-Layout_Balance_General.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListLayout_Balance_GeneralComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Layout_Balance_GeneralComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Layout_Balance_GeneralComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Layout_Balance_GeneralComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterLayout_Balance_GeneralComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Layout_Balance_GeneralRoutingModule {
 }

