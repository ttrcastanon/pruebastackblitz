import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from '../../shared/services/auth-guard.service';
import { Ejecucion_de_VueloComponent } from './Ejecucion_de_Vuelo-add-edit/Ejecucion_de_Vuelo.component';
import { ListEjecucion_de_VueloComponent } from './list-Ejecucion_de_Vuelo/list-Ejecucion_de_Vuelo.component';
import { ShowAdvanceFilterEjecucion_de_VueloComponent } from './show-advance-filter-Ejecucion_de_Vuelo/show-advance-filter-Ejecucion_de_Vuelo.component';


const routes: Routes = [
  {
    path: 'list',
    component: ListEjecucion_de_VueloComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Ejecucion_de_VueloComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Ejecucion_de_VueloComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Ejecucion_de_VueloComponent,
    canActivate: [AuthGuardService],
    data: { readOnly: true }
  },
  {
    path: 'showadvancefilter',
    component: ShowAdvanceFilterEjecucion_de_VueloComponent,
    canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Ejecucion_de_VueloRoutingModule {
}

