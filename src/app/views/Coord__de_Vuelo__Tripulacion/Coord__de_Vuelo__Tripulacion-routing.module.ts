import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Coord__de_Vuelo__TripulacionComponent } from './Coord__de_Vuelo__Tripulacion-add-edit/Coord__de_Vuelo__Tripulacion.component';
import { ListCoord__de_Vuelo__TripulacionComponent } from './list-Coord__de_Vuelo__Tripulacion/list-Coord__de_Vuelo__Tripulacion.component';
import { ShowAdvanceFilterCoord__de_Vuelo__TripulacionComponent } from './show-advance-filter-Coord__de_Vuelo__Tripulacion/show-advance-filter-Coord__de_Vuelo__Tripulacion.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListCoord__de_Vuelo__TripulacionComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Coord__de_Vuelo__TripulacionComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Coord__de_Vuelo__TripulacionComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Coord__de_Vuelo__TripulacionComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterCoord__de_Vuelo__TripulacionComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Coord__de_Vuelo__TripulacionRoutingModule {
 }

