import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { SexoComponent } from './Sexo-add-edit/Sexo.component';
import { ListSexoComponent } from './list-Sexo/list-Sexo.component';
import { ShowAdvanceFilterSexoComponent } from './show-advance-filter-Sexo/show-advance-filter-Sexo.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListSexoComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: SexoComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: SexoComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: SexoComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterSexoComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class SexoRoutingModule {
 }

