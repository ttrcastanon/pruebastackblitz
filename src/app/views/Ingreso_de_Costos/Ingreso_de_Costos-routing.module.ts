import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Ingreso_de_CostosComponent } from './Ingreso_de_Costos-add-edit/Ingreso_de_Costos.component';
import { ListIngreso_de_CostosComponent } from './list-Ingreso_de_Costos/list-Ingreso_de_Costos.component';
import { ShowAdvanceFilterIngreso_de_CostosComponent } from './show-advance-filter-Ingreso_de_Costos/show-advance-filter-Ingreso_de_Costos.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListIngreso_de_CostosComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Ingreso_de_CostosComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Ingreso_de_CostosComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Ingreso_de_CostosComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterIngreso_de_CostosComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Ingreso_de_CostosRoutingModule {
 }

