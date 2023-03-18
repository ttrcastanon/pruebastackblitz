import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Estatus_Parte_Asociada_al_ComponenteComponent } from './Estatus_Parte_Asociada_al_Componente-add-edit/Estatus_Parte_Asociada_al_Componente.component';
import { ListEstatus_Parte_Asociada_al_ComponenteComponent } from './list-Estatus_Parte_Asociada_al_Componente/list-Estatus_Parte_Asociada_al_Componente.component';
import { ShowAdvanceFilterEstatus_Parte_Asociada_al_ComponenteComponent } from './show-advance-filter-Estatus_Parte_Asociada_al_Componente/show-advance-filter-Estatus_Parte_Asociada_al_Componente.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListEstatus_Parte_Asociada_al_ComponenteComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Estatus_Parte_Asociada_al_ComponenteComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Estatus_Parte_Asociada_al_ComponenteComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Estatus_Parte_Asociada_al_ComponenteComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterEstatus_Parte_Asociada_al_ComponenteComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Estatus_Parte_Asociada_al_ComponenteRoutingModule {
 }

