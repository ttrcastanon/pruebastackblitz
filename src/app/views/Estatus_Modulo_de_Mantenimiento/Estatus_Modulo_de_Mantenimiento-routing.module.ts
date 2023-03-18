import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Estatus_Modulo_de_MantenimientoComponent } from './Estatus_Modulo_de_Mantenimiento-add-edit/Estatus_Modulo_de_Mantenimiento.component';
import { ListEstatus_Modulo_de_MantenimientoComponent } from './list-Estatus_Modulo_de_Mantenimiento/list-Estatus_Modulo_de_Mantenimiento.component';
import { ShowAdvanceFilterEstatus_Modulo_de_MantenimientoComponent } from './show-advance-filter-Estatus_Modulo_de_Mantenimiento/show-advance-filter-Estatus_Modulo_de_Mantenimiento.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListEstatus_Modulo_de_MantenimientoComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Estatus_Modulo_de_MantenimientoComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Estatus_Modulo_de_MantenimientoComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Estatus_Modulo_de_MantenimientoComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterEstatus_Modulo_de_MantenimientoComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Estatus_Modulo_de_MantenimientoRoutingModule {
 }

