import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { CargosComponent } from './Cargos-add-edit/Cargos.component';
import { ListCargosComponent } from './list-Cargos/list-Cargos.component';
import { ShowAdvanceFilterCargosComponent } from './show-advance-filter-Cargos/show-advance-filter-Cargos.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListCargosComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: CargosComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: CargosComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: CargosComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterCargosComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class CargosRoutingModule {
 }

