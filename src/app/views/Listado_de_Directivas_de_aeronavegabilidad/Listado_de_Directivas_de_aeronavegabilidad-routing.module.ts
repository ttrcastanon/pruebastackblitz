import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Listado_de_Directivas_de_aeronavegabilidadComponent } from './Listado_de_Directivas_de_aeronavegabilidad-add-edit/Listado_de_Directivas_de_aeronavegabilidad.component';
import { ListListado_de_Directivas_de_aeronavegabilidadComponent } from './list-Listado_de_Directivas_de_aeronavegabilidad/list-Listado_de_Directivas_de_aeronavegabilidad.component';
import { ShowAdvanceFilterListado_de_Directivas_de_aeronavegabilidadComponent } from './show-advance-filter-Listado_de_Directivas_de_aeronavegabilidad/show-advance-filter-Listado_de_Directivas_de_aeronavegabilidad.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListListado_de_Directivas_de_aeronavegabilidadComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Listado_de_Directivas_de_aeronavegabilidadComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Listado_de_Directivas_de_aeronavegabilidadComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Listado_de_Directivas_de_aeronavegabilidadComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterListado_de_Directivas_de_aeronavegabilidadComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Listado_de_Directivas_de_aeronavegabilidadRoutingModule {
 }

