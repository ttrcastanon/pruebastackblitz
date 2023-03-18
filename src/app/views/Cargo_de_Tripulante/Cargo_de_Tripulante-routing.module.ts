import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Cargo_de_TripulanteComponent } from './Cargo_de_Tripulante-add-edit/Cargo_de_Tripulante.component';
import { ListCargo_de_TripulanteComponent } from './list-Cargo_de_Tripulante/list-Cargo_de_Tripulante.component';
import { ShowAdvanceFilterCargo_de_TripulanteComponent } from './show-advance-filter-Cargo_de_Tripulante/show-advance-filter-Cargo_de_Tripulante.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListCargo_de_TripulanteComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Cargo_de_TripulanteComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Cargo_de_TripulanteComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Cargo_de_TripulanteComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterCargo_de_TripulanteComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Cargo_de_TripulanteRoutingModule {
 }

