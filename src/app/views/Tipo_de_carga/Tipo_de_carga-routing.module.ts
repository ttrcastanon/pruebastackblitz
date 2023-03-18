import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Tipo_de_cargaComponent } from './Tipo_de_carga-add-edit/Tipo_de_carga.component';
import { ListTipo_de_cargaComponent } from './list-Tipo_de_carga/list-Tipo_de_carga.component';
import { ShowAdvanceFilterTipo_de_cargaComponent } from './show-advance-filter-Tipo_de_carga/show-advance-filter-Tipo_de_carga.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListTipo_de_cargaComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Tipo_de_cargaComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Tipo_de_cargaComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Tipo_de_cargaComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterTipo_de_cargaComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Tipo_de_cargaRoutingModule {
 }

