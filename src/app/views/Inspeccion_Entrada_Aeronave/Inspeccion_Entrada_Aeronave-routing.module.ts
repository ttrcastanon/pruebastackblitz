import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Inspeccion_Entrada_AeronaveComponent } from './Inspeccion_Entrada_Aeronave-add-edit/Inspeccion_Entrada_Aeronave.component';
import { ListInspeccion_Entrada_AeronaveComponent } from './list-Inspeccion_Entrada_Aeronave/list-Inspeccion_Entrada_Aeronave.component';
import { ShowAdvanceFilterInspeccion_Entrada_AeronaveComponent } from './show-advance-filter-Inspeccion_Entrada_Aeronave/show-advance-filter-Inspeccion_Entrada_Aeronave.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListInspeccion_Entrada_AeronaveComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Inspeccion_Entrada_AeronaveComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Inspeccion_Entrada_AeronaveComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Inspeccion_Entrada_AeronaveComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterInspeccion_Entrada_AeronaveComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Inspeccion_Entrada_AeronaveRoutingModule {
 }

