import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Razon_de_la_CompraComponent } from './Razon_de_la_Compra-add-edit/Razon_de_la_Compra.component';
import { ListRazon_de_la_CompraComponent } from './list-Razon_de_la_Compra/list-Razon_de_la_Compra.component';
import { ShowAdvanceFilterRazon_de_la_CompraComponent } from './show-advance-filter-Razon_de_la_Compra/show-advance-filter-Razon_de_la_Compra.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListRazon_de_la_CompraComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Razon_de_la_CompraComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Razon_de_la_CompraComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Razon_de_la_CompraComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterRazon_de_la_CompraComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Razon_de_la_CompraRoutingModule {
 }

