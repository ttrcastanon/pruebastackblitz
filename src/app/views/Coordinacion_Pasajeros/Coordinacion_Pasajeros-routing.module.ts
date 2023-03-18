import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Coordinacion_PasajerosComponent } from './Coordinacion_Pasajeros-add-edit/Coordinacion_Pasajeros.component';
import { ListCoordinacion_PasajerosComponent } from './list-Coordinacion_Pasajeros/list-Coordinacion_Pasajeros.component';
import { ShowAdvanceFilterCoordinacion_PasajerosComponent } from './show-advance-filter-Coordinacion_Pasajeros/show-advance-filter-Coordinacion_Pasajeros.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListCoordinacion_PasajerosComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Coordinacion_PasajerosComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Coordinacion_PasajerosComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Coordinacion_PasajerosComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterCoordinacion_PasajerosComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Coordinacion_PasajerosRoutingModule {
 }

