import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Cierre_de_VueloComponent } from './Cierre_de_Vuelo-add-edit/Cierre_de_Vuelo.component';
import { ListCierre_de_VueloComponent } from './list-Cierre_de_Vuelo/list-Cierre_de_Vuelo.component';
import { ShowAdvanceFilterCierre_de_VueloComponent } from './show-advance-filter-Cierre_de_Vuelo/show-advance-filter-Cierre_de_Vuelo.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListCierre_de_VueloComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Cierre_de_VueloComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Cierre_de_VueloComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Cierre_de_VueloComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterCierre_de_VueloComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Cierre_de_VueloRoutingModule {
 }

