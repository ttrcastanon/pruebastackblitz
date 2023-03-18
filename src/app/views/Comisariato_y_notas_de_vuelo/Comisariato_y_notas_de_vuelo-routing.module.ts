import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Comisariato_y_notas_de_vueloComponent } from './Comisariato_y_notas_de_vuelo-add-edit/Comisariato_y_notas_de_vuelo.component';
import { ListComisariato_y_notas_de_vueloComponent } from './list-Comisariato_y_notas_de_vuelo/list-Comisariato_y_notas_de_vuelo.component';
import { ShowAdvanceFilterComisariato_y_notas_de_vueloComponent } from './show-advance-filter-Comisariato_y_notas_de_vuelo/show-advance-filter-Comisariato_y_notas_de_vuelo.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListComisariato_y_notas_de_vueloComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Comisariato_y_notas_de_vueloComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Comisariato_y_notas_de_vueloComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Comisariato_y_notas_de_vueloComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterComisariato_y_notas_de_vueloComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Comisariato_y_notas_de_vueloRoutingModule {
 }

