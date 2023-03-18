import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { FabricanteComponent } from './Fabricante-add-edit/Fabricante.component';
import { ListFabricanteComponent } from './list-Fabricante/list-Fabricante.component';
import { ShowAdvanceFilterFabricanteComponent } from './show-advance-filter-Fabricante/show-advance-filter-Fabricante.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListFabricanteComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: FabricanteComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: FabricanteComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: FabricanteComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterFabricanteComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class FabricanteRoutingModule {
 }

