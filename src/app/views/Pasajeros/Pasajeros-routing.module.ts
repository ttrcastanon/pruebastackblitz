import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { PasajerosComponent } from './Pasajeros-add-edit/Pasajeros.component';
import { ListPasajerosComponent } from './list-Pasajeros/list-Pasajeros.component';
import { ShowAdvanceFilterPasajerosComponent } from './show-advance-filter-Pasajeros/show-advance-filter-Pasajeros.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListPasajerosComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: PasajerosComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: PasajerosComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: PasajerosComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterPasajerosComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class PasajerosRoutingModule {
 }

