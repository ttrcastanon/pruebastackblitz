import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Tiempo_de_remocionComponent } from './Tiempo_de_remocion-add-edit/Tiempo_de_remocion.component';
import { ListTiempo_de_remocionComponent } from './list-Tiempo_de_remocion/list-Tiempo_de_remocion.component';
import { ShowAdvanceFilterTiempo_de_remocionComponent } from './show-advance-filter-Tiempo_de_remocion/show-advance-filter-Tiempo_de_remocion.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListTiempo_de_remocionComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Tiempo_de_remocionComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Tiempo_de_remocionComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Tiempo_de_remocionComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterTiempo_de_remocionComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Tiempo_de_remocionRoutingModule {
 }

