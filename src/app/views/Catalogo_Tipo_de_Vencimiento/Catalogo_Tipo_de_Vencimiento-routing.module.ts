import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Catalogo_Tipo_de_VencimientoComponent } from './Catalogo_Tipo_de_Vencimiento-add-edit/Catalogo_Tipo_de_Vencimiento.component';
import { ListCatalogo_Tipo_de_VencimientoComponent } from './list-Catalogo_Tipo_de_Vencimiento/list-Catalogo_Tipo_de_Vencimiento.component';
import { ShowAdvanceFilterCatalogo_Tipo_de_VencimientoComponent } from './show-advance-filter-Catalogo_Tipo_de_Vencimiento/show-advance-filter-Catalogo_Tipo_de_Vencimiento.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListCatalogo_Tipo_de_VencimientoComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Catalogo_Tipo_de_VencimientoComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Catalogo_Tipo_de_VencimientoComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Catalogo_Tipo_de_VencimientoComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterCatalogo_Tipo_de_VencimientoComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Catalogo_Tipo_de_VencimientoRoutingModule {
 }

