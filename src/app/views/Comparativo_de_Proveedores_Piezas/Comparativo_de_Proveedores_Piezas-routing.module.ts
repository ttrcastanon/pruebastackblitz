import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Comparativo_de_Proveedores_PiezasComponent } from './Comparativo_de_Proveedores_Piezas-add-edit/Comparativo_de_Proveedores_Piezas.component';
import { ListComparativo_de_Proveedores_PiezasComponent } from './list-Comparativo_de_Proveedores_Piezas/list-Comparativo_de_Proveedores_Piezas.component';
import { ShowAdvanceFilterComparativo_de_Proveedores_PiezasComponent } from './show-advance-filter-Comparativo_de_Proveedores_Piezas/show-advance-filter-Comparativo_de_Proveedores_Piezas.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListComparativo_de_Proveedores_PiezasComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'list/:id',
     component: ListComparativo_de_Proveedores_PiezasComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Comparativo_de_Proveedores_PiezasComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Comparativo_de_Proveedores_PiezasComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Comparativo_de_Proveedores_PiezasComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterComparativo_de_Proveedores_PiezasComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Comparativo_de_Proveedores_PiezasRoutingModule {
 }

