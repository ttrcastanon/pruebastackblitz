import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Consecutivo_Numero_de_vueloComponent } from './Consecutivo_Numero_de_vuelo-add-edit/Consecutivo_Numero_de_vuelo.component';
import { ListConsecutivo_Numero_de_vueloComponent } from './list-Consecutivo_Numero_de_vuelo/list-Consecutivo_Numero_de_vuelo.component';
import { ShowAdvanceFilterConsecutivo_Numero_de_vueloComponent } from './show-advance-filter-Consecutivo_Numero_de_vuelo/show-advance-filter-Consecutivo_Numero_de_vuelo.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListConsecutivo_Numero_de_vueloComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Consecutivo_Numero_de_vueloComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Consecutivo_Numero_de_vueloComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Consecutivo_Numero_de_vueloComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterConsecutivo_Numero_de_vueloComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Consecutivo_Numero_de_vueloRoutingModule {
 }

