import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { TripulacionComponent } from './Tripulacion-add-edit/Tripulacion.component';
import { ListTripulacionComponent } from './list-Tripulacion/list-Tripulacion.component';
import { ShowAdvanceFilterTripulacionComponent } from './show-advance-filter-Tripulacion/show-advance-filter-Tripulacion.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListTripulacionComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: TripulacionComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: TripulacionComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: TripulacionComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterTripulacionComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class TripulacionRoutingModule {
 }

