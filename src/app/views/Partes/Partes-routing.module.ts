import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { PartesComponent } from './Partes-add-edit/Partes.component';
import { ListPartesComponent } from './list-Partes/list-Partes.component';
import { ShowAdvanceFilterPartesComponent } from './show-advance-filter-Partes/show-advance-filter-Partes.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListPartesComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: PartesComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: PartesComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: PartesComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterPartesComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class PartesRoutingModule {
 }

