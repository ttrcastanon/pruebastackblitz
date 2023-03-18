import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Remocion_e_instalacion_de_piezasComponent } from './Remocion_e_instalacion_de_piezas-add-edit/Remocion_e_instalacion_de_piezas.component';
import { ListRemocion_e_instalacion_de_piezasComponent } from './list-Remocion_e_instalacion_de_piezas/list-Remocion_e_instalacion_de_piezas.component';
import { ShowAdvanceFilterRemocion_e_instalacion_de_piezasComponent } from './show-advance-filter-Remocion_e_instalacion_de_piezas/show-advance-filter-Remocion_e_instalacion_de_piezas.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListRemocion_e_instalacion_de_piezasComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Remocion_e_instalacion_de_piezasComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Remocion_e_instalacion_de_piezasComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Remocion_e_instalacion_de_piezasComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterRemocion_e_instalacion_de_piezasComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Remocion_e_instalacion_de_piezasRoutingModule {
 }

