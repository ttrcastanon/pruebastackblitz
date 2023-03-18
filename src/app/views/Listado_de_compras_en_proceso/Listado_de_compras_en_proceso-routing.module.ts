import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Listado_de_compras_en_procesoComponent } from './Listado_de_compras_en_proceso-add-edit/Listado_de_compras_en_proceso.component';
import { ListListado_de_compras_en_procesoComponent } from './list-Listado_de_compras_en_proceso/list-Listado_de_compras_en_proceso.component';
import { ShowAdvanceFilterListado_de_compras_en_procesoComponent } from './show-advance-filter-Listado_de_compras_en_proceso/show-advance-filter-Listado_de_compras_en_proceso.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListListado_de_compras_en_procesoComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Listado_de_compras_en_procesoComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Listado_de_compras_en_procesoComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Listado_de_compras_en_procesoComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterListado_de_compras_en_procesoComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Listado_de_compras_en_procesoRoutingModule {
 }

