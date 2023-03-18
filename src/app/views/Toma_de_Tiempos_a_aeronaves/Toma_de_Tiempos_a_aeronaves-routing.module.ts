import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Toma_de_Tiempos_a_aeronavesComponent } from './Toma_de_Tiempos_a_aeronaves-add-edit/Toma_de_Tiempos_a_aeronaves.component';
import { ListToma_de_Tiempos_a_aeronavesComponent } from './list-Toma_de_Tiempos_a_aeronaves/list-Toma_de_Tiempos_a_aeronaves.component';
import { ShowAdvanceFilterToma_de_Tiempos_a_aeronavesComponent } from './show-advance-filter-Toma_de_Tiempos_a_aeronaves/show-advance-filter-Toma_de_Tiempos_a_aeronaves.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListToma_de_Tiempos_a_aeronavesComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Toma_de_Tiempos_a_aeronavesComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Toma_de_Tiempos_a_aeronavesComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Toma_de_Tiempos_a_aeronavesComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterToma_de_Tiempos_a_aeronavesComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Toma_de_Tiempos_a_aeronavesRoutingModule {
 }

