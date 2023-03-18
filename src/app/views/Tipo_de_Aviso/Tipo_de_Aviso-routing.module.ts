import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Tipo_de_AvisoComponent } from './Tipo_de_Aviso-add-edit/Tipo_de_Aviso.component';
import { ListTipo_de_AvisoComponent } from './list-Tipo_de_Aviso/list-Tipo_de_Aviso.component';
import { ShowAdvanceFilterTipo_de_AvisoComponent } from './show-advance-filter-Tipo_de_Aviso/show-advance-filter-Tipo_de_Aviso.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListTipo_de_AvisoComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Tipo_de_AvisoComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Tipo_de_AvisoComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Tipo_de_AvisoComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterTipo_de_AvisoComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Tipo_de_AvisoRoutingModule {
 }

