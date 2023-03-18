import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Salida_en_Almacen_de_partesComponent } from './Salida_en_Almacen_de_partes-add-edit/Salida_en_Almacen_de_partes.component';
import { ListSalida_en_Almacen_de_partesComponent } from './list-Salida_en_Almacen_de_partes/list-Salida_en_Almacen_de_partes.component';
import { ShowAdvanceFilterSalida_en_Almacen_de_partesComponent } from './show-advance-filter-Salida_en_Almacen_de_partes/show-advance-filter-Salida_en_Almacen_de_partes.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListSalida_en_Almacen_de_partesComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Salida_en_Almacen_de_partesComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Salida_en_Almacen_de_partesComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Salida_en_Almacen_de_partesComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterSalida_en_Almacen_de_partesComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Salida_en_Almacen_de_partesRoutingModule {
 }

