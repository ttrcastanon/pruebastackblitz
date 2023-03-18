import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Clasificacion_de_aeronavegabilidadComponent } from './Clasificacion_de_aeronavegabilidad-add-edit/Clasificacion_de_aeronavegabilidad.component';
import { ListClasificacion_de_aeronavegabilidadComponent } from './list-Clasificacion_de_aeronavegabilidad/list-Clasificacion_de_aeronavegabilidad.component';
import { ShowAdvanceFilterClasificacion_de_aeronavegabilidadComponent } from './show-advance-filter-Clasificacion_de_aeronavegabilidad/show-advance-filter-Clasificacion_de_aeronavegabilidad.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListClasificacion_de_aeronavegabilidadComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Clasificacion_de_aeronavegabilidadComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Clasificacion_de_aeronavegabilidadComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Clasificacion_de_aeronavegabilidadComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterClasificacion_de_aeronavegabilidadComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Clasificacion_de_aeronavegabilidadRoutingModule {
 }

