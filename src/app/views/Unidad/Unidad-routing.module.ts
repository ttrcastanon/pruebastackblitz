import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { UnidadComponent } from './Unidad-add-edit/Unidad.component';
import { ListUnidadComponent } from './list-Unidad/list-Unidad.component';
import { ShowAdvanceFilterUnidadComponent } from './show-advance-filter-Unidad/show-advance-filter-Unidad.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListUnidadComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: UnidadComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: UnidadComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: UnidadComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterUnidadComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class UnidadRoutingModule {
 }

