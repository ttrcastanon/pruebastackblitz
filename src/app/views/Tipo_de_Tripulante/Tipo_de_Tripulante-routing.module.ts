import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Tipo_de_TripulanteComponent } from './Tipo_de_Tripulante-add-edit/Tipo_de_Tripulante.component';
import { ListTipo_de_TripulanteComponent } from './list-Tipo_de_Tripulante/list-Tipo_de_Tripulante.component';
import { ShowAdvanceFilterTipo_de_TripulanteComponent } from './show-advance-filter-Tipo_de_Tripulante/show-advance-filter-Tipo_de_Tripulante.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListTipo_de_TripulanteComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Tipo_de_TripulanteComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Tipo_de_TripulanteComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Tipo_de_TripulanteComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterTipo_de_TripulanteComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Tipo_de_TripulanteRoutingModule {
 }

