import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Tipo_de_InstalacionComponent } from './Tipo_de_Instalacion-add-edit/Tipo_de_Instalacion.component';
import { ListTipo_de_InstalacionComponent } from './list-Tipo_de_Instalacion/list-Tipo_de_Instalacion.component';
import { ShowAdvanceFilterTipo_de_InstalacionComponent } from './show-advance-filter-Tipo_de_Instalacion/show-advance-filter-Tipo_de_Instalacion.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListTipo_de_InstalacionComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Tipo_de_InstalacionComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Tipo_de_InstalacionComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Tipo_de_InstalacionComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterTipo_de_InstalacionComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Tipo_de_InstalacionRoutingModule {
 }

