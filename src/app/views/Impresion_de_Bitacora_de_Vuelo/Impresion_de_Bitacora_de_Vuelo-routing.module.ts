import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Impresion_de_Bitacora_de_VueloComponent } from './Impresion_de_Bitacora_de_Vuelo-add-edit/Impresion_de_Bitacora_de_Vuelo.component';
import { ListImpresion_de_Bitacora_de_VueloComponent } from './list-Impresion_de_Bitacora_de_Vuelo/list-Impresion_de_Bitacora_de_Vuelo.component';
import { ShowAdvanceFilterImpresion_de_Bitacora_de_VueloComponent } from './show-advance-filter-Impresion_de_Bitacora_de_Vuelo/show-advance-filter-Impresion_de_Bitacora_de_Vuelo.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListImpresion_de_Bitacora_de_VueloComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Impresion_de_Bitacora_de_VueloComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Impresion_de_Bitacora_de_VueloComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Impresion_de_Bitacora_de_VueloComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterImpresion_de_Bitacora_de_VueloComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Impresion_de_Bitacora_de_VueloRoutingModule {
 }

