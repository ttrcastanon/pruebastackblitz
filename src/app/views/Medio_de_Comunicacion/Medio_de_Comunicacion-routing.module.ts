import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Medio_de_ComunicacionComponent } from './Medio_de_Comunicacion-add-edit/Medio_de_Comunicacion.component';
import { ListMedio_de_ComunicacionComponent } from './list-Medio_de_Comunicacion/list-Medio_de_Comunicacion.component';
import { ShowAdvanceFilterMedio_de_ComunicacionComponent } from './show-advance-filter-Medio_de_Comunicacion/show-advance-filter-Medio_de_Comunicacion.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListMedio_de_ComunicacionComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Medio_de_ComunicacionComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Medio_de_ComunicacionComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Medio_de_ComunicacionComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterMedio_de_ComunicacionComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Medio_de_ComunicacionRoutingModule {
 }

