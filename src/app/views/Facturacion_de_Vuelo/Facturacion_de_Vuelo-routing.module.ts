import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from '../../shared/services/auth-guard.service';
import { Facturacion_de_VueloComponent } from './Facturacion_de_Vuelo-add-edit/Facturacion_de_Vuelo.component';
import { ListFacturacion_de_VueloComponent } from './list-Facturacion_de_Vuelo/list-Facturacion_de_Vuelo.component';
import { ShowAdvanceFilterFacturacion_de_VueloComponent } from './show-advance-filter-Facturacion_de_Vuelo/show-advance-filter-Facturacion_de_Vuelo.component';


const routes: Routes = [
  {
    path: 'list',
    component: ListFacturacion_de_VueloComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'list/:id',
    component: ListFacturacion_de_VueloComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Facturacion_de_VueloComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Facturacion_de_VueloComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Facturacion_de_VueloComponent,
    canActivate: [AuthGuardService],
    data: { readOnly: true }
  },
  {
    path: 'showadvancefilter',
    component: ShowAdvanceFilterFacturacion_de_VueloComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: "**",
    redirectTo: "list"
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Facturacion_de_VueloRoutingModule {
}

