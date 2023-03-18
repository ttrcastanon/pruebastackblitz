import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Tarifas_de_Vuelo_de_AeronaveComponent } from './Tarifas_de_Vuelo_de_Aeronave-add-edit/Tarifas_de_Vuelo_de_Aeronave.component';
import { ListTarifas_de_Vuelo_de_AeronaveComponent } from './list-Tarifas_de_Vuelo_de_Aeronave/list-Tarifas_de_Vuelo_de_Aeronave.component';
import { ShowAdvanceFilterTarifas_de_Vuelo_de_AeronaveComponent } from './show-advance-filter-Tarifas_de_Vuelo_de_Aeronave/show-advance-filter-Tarifas_de_Vuelo_de_Aeronave.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListTarifas_de_Vuelo_de_AeronaveComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Tarifas_de_Vuelo_de_AeronaveComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Tarifas_de_Vuelo_de_AeronaveComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Tarifas_de_Vuelo_de_AeronaveComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterTarifas_de_Vuelo_de_AeronaveComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Tarifas_de_Vuelo_de_AeronaveRoutingModule {
 }

