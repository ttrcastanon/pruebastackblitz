import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Tipo_de_Medio_de_ComunicacionComponent } from './Tipo_de_Medio_de_Comunicacion-add-edit/Tipo_de_Medio_de_Comunicacion.component';
import { ListTipo_de_Medio_de_ComunicacionComponent } from './list-Tipo_de_Medio_de_Comunicacion/list-Tipo_de_Medio_de_Comunicacion.component';
import { ShowAdvanceFilterTipo_de_Medio_de_ComunicacionComponent } from './show-advance-filter-Tipo_de_Medio_de_Comunicacion/show-advance-filter-Tipo_de_Medio_de_Comunicacion.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListTipo_de_Medio_de_ComunicacionComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Tipo_de_Medio_de_ComunicacionComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Tipo_de_Medio_de_ComunicacionComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Tipo_de_Medio_de_ComunicacionComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterTipo_de_Medio_de_ComunicacionComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Tipo_de_Medio_de_ComunicacionRoutingModule {
 }

