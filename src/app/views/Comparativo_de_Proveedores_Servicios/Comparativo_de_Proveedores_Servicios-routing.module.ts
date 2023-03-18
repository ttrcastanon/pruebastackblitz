import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Comparativo_de_Proveedores_ServiciosComponent } from './Comparativo_de_Proveedores_Servicios-add-edit/Comparativo_de_Proveedores_Servicios.component';
import { ListComparativo_de_Proveedores_ServiciosComponent } from './list-Comparativo_de_Proveedores_Servicios/list-Comparativo_de_Proveedores_Servicios.component';
import { ShowAdvanceFilterComparativo_de_Proveedores_ServiciosComponent } from './show-advance-filter-Comparativo_de_Proveedores_Servicios/show-advance-filter-Comparativo_de_Proveedores_Servicios.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListComparativo_de_Proveedores_ServiciosComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Comparativo_de_Proveedores_ServiciosComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Comparativo_de_Proveedores_ServiciosComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Comparativo_de_Proveedores_ServiciosComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterComparativo_de_Proveedores_ServiciosComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Comparativo_de_Proveedores_ServiciosRoutingModule {
 }

