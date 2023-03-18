import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Registro_de_Distancia_SENEAMComponent } from './Registro_de_Distancia_SENEAM-add-edit/Registro_de_Distancia_SENEAM.component';
import { ListRegistro_de_Distancia_SENEAMComponent } from './list-Registro_de_Distancia_SENEAM/list-Registro_de_Distancia_SENEAM.component';
import { ShowAdvanceFilterRegistro_de_Distancia_SENEAMComponent } from './show-advance-filter-Registro_de_Distancia_SENEAM/show-advance-filter-Registro_de_Distancia_SENEAM.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListRegistro_de_Distancia_SENEAMComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Registro_de_Distancia_SENEAMComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Registro_de_Distancia_SENEAMComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Registro_de_Distancia_SENEAMComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterRegistro_de_Distancia_SENEAMComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Registro_de_Distancia_SENEAMRoutingModule {
 }

