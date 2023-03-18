import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Tipo_de_productoComponent } from './Tipo_de_producto-add-edit/Tipo_de_producto.component';
import { ListTipo_de_productoComponent } from './list-Tipo_de_producto/list-Tipo_de_producto.component';
import { ShowAdvanceFilterTipo_de_productoComponent } from './show-advance-filter-Tipo_de_producto/show-advance-filter-Tipo_de_producto.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListTipo_de_productoComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Tipo_de_productoComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Tipo_de_productoComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Tipo_de_productoComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterTipo_de_productoComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Tipo_de_productoRoutingModule {
 }

