import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Detalle_Cursos_PasajerosComponent } from './Detalle_Cursos_Pasajeros-add-edit/Detalle_Cursos_Pasajeros.component';
import { ListDetalle_Cursos_PasajerosComponent } from './list-Detalle_Cursos_Pasajeros/list-Detalle_Cursos_Pasajeros.component';
import { ShowAdvanceFilterDetalle_Cursos_PasajerosComponent } from './show-advance-filter-Detalle_Cursos_Pasajeros/show-advance-filter-Detalle_Cursos_Pasajeros.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListDetalle_Cursos_PasajerosComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Detalle_Cursos_PasajerosComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Detalle_Cursos_PasajerosComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Detalle_Cursos_PasajerosComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterDetalle_Cursos_PasajerosComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Detalle_Cursos_PasajerosRoutingModule {
 }

