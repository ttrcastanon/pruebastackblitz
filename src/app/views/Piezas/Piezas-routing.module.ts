import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { PiezasComponent } from './Piezas-add-edit/Piezas.component';
import { ListPiezasComponent } from './list-Piezas/list-Piezas.component';
import { ShowAdvanceFilterPiezasComponent } from './show-advance-filter-Piezas/show-advance-filter-Piezas.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListPiezasComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: PiezasComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: PiezasComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: PiezasComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterPiezasComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class PiezasRoutingModule {
 }

