import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from '../../shared/services/auth-guard.service';
import { Gestion_de_aprobacion_de_mantenimientoComponent } from './Gestion_de_aprobacion_de_mantenimiento-add-edit/Gestion_de_aprobacion_de_mantenimiento.component';
import { ListGestion_de_aprobacion_de_mantenimientoComponent } from './list-Gestion_de_aprobacion_de_mantenimiento/list-Gestion_de_aprobacion_de_mantenimiento.component';
import { ShowAdvanceFilterGestion_de_aprobacion_de_mantenimientoComponent } from './show-advance-filter-Gestion_de_aprobacion_de_mantenimiento/show-advance-filter-Gestion_de_aprobacion_de_mantenimiento.component';


const routes: Routes = [
  {
    path: 'list',
    component: ListGestion_de_aprobacion_de_mantenimientoComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'list/:id',
    component: ListGestion_de_aprobacion_de_mantenimientoComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Gestion_de_aprobacion_de_mantenimientoComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Gestion_de_aprobacion_de_mantenimientoComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Gestion_de_aprobacion_de_mantenimientoComponent,
    canActivate: [AuthGuardService],
    data: { readOnly: true }
  },
  {
    path: 'showadvancefilter',
    component: ShowAdvanceFilterGestion_de_aprobacion_de_mantenimientoComponent,
    canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Gestion_de_aprobacion_de_mantenimientoRoutingModule {
}

