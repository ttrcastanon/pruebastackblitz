import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Historial_de_Remocion_de_partesComponent } from './Historial_de_Remocion_de_partes-add-edit/Historial_de_Remocion_de_partes.component';
import { ListHistorial_de_Remocion_de_partesComponent } from './list-Historial_de_Remocion_de_partes/list-Historial_de_Remocion_de_partes.component';
import { ShowAdvanceFilterHistorial_de_Remocion_de_partesComponent } from './show-advance-filter-Historial_de_Remocion_de_partes/show-advance-filter-Historial_de_Remocion_de_partes.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListHistorial_de_Remocion_de_partesComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Historial_de_Remocion_de_partesComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Historial_de_Remocion_de_partesComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Historial_de_Remocion_de_partesComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterHistorial_de_Remocion_de_partesComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Historial_de_Remocion_de_partesRoutingModule {
 }

