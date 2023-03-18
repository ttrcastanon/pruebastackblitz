import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Aplicacion__de_PrestamoComponent } from './Aplicacion__de_Prestamo-add-edit/Aplicacion__de_Prestamo.component';
import { ListAplicacion__de_PrestamoComponent } from './list-Aplicacion__de_Prestamo/list-Aplicacion__de_Prestamo.component';
import { ShowAdvanceFilterAplicacion__de_PrestamoComponent } from './show-advance-filter-Aplicacion__de_Prestamo/show-advance-filter-Aplicacion__de_Prestamo.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListAplicacion__de_PrestamoComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Aplicacion__de_PrestamoComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Aplicacion__de_PrestamoComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Aplicacion__de_PrestamoComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterAplicacion__de_PrestamoComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Aplicacion__de_PrestamoRoutingModule {
 }

