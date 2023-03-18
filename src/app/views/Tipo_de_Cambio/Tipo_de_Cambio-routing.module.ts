import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Tipo_de_CambioComponent } from './Tipo_de_Cambio-add-edit/Tipo_de_Cambio.component';
import { ListTipo_de_CambioComponent } from './list-Tipo_de_Cambio/list-Tipo_de_Cambio.component';
import { ShowAdvanceFilterTipo_de_CambioComponent } from './show-advance-filter-Tipo_de_Cambio/show-advance-filter-Tipo_de_Cambio.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListTipo_de_CambioComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Tipo_de_CambioComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Tipo_de_CambioComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Tipo_de_CambioComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterTipo_de_CambioComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Tipo_de_CambioRoutingModule {
 }

