import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { NacionalidadComponent } from './Nacionalidad-add-edit/Nacionalidad.component';
import { ListNacionalidadComponent } from './list-Nacionalidad/list-Nacionalidad.component';
import { ShowAdvanceFilterNacionalidadComponent } from './show-advance-filter-Nacionalidad/show-advance-filter-Nacionalidad.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListNacionalidadComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: NacionalidadComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: NacionalidadComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: NacionalidadComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterNacionalidadComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class NacionalidadRoutingModule {
 }

