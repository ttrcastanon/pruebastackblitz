import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Coordinacion_HandlingComponent } from './Coordinacion_Handling-add-edit/Coordinacion_Handling.component';
import { ListCoordinacion_HandlingComponent } from './list-Coordinacion_Handling/list-Coordinacion_Handling.component';
import { ShowAdvanceFilterCoordinacion_HandlingComponent } from './show-advance-filter-Coordinacion_Handling/show-advance-filter-Coordinacion_Handling.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListCoordinacion_HandlingComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Coordinacion_HandlingComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Coordinacion_HandlingComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Coordinacion_HandlingComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterCoordinacion_HandlingComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Coordinacion_HandlingRoutingModule {
 }

