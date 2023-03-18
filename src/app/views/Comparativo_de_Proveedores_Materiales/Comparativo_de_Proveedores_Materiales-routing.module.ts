import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Comparativo_de_Proveedores_MaterialesComponent } from './Comparativo_de_Proveedores_Materiales-add-edit/Comparativo_de_Proveedores_Materiales.component';
import { ListComparativo_de_Proveedores_MaterialesComponent } from './list-Comparativo_de_Proveedores_Materiales/list-Comparativo_de_Proveedores_Materiales.component';
import { ShowAdvanceFilterComparativo_de_Proveedores_MaterialesComponent } from './show-advance-filter-Comparativo_de_Proveedores_Materiales/show-advance-filter-Comparativo_de_Proveedores_Materiales.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListComparativo_de_Proveedores_MaterialesComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Comparativo_de_Proveedores_MaterialesComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Comparativo_de_Proveedores_MaterialesComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Comparativo_de_Proveedores_MaterialesComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterComparativo_de_Proveedores_MaterialesComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Comparativo_de_Proveedores_MaterialesRoutingModule {
 }

