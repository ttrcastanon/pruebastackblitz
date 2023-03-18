import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Modulo_de_MantenimientoComponent } from './Modulo_de_Mantenimiento-add-edit/Modulo_de_Mantenimiento.component';
import { ListModulo_de_MantenimientoComponent } from './list-Modulo_de_Mantenimiento/list-Modulo_de_Mantenimiento.component';
import { ShowAdvanceFilterModulo_de_MantenimientoComponent } from './show-advance-filter-Modulo_de_Mantenimiento/show-advance-filter-Modulo_de_Mantenimiento.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListModulo_de_MantenimientoComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Modulo_de_MantenimientoComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Modulo_de_MantenimientoComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Modulo_de_MantenimientoComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterModulo_de_MantenimientoComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Modulo_de_MantenimientoRoutingModule {
 }

