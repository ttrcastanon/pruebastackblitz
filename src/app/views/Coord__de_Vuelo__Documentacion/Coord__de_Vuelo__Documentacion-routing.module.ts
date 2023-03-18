import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Coord__de_Vuelo__DocumentacionComponent } from './Coord__de_Vuelo__Documentacion-add-edit/Coord__de_Vuelo__Documentacion.component';
import { ListCoord__de_Vuelo__DocumentacionComponent } from './list-Coord__de_Vuelo__Documentacion/list-Coord__de_Vuelo__Documentacion.component';
import { ShowAdvanceFilterCoord__de_Vuelo__DocumentacionComponent } from './show-advance-filter-Coord__de_Vuelo__Documentacion/show-advance-filter-Coord__de_Vuelo__Documentacion.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListCoord__de_Vuelo__DocumentacionComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Coord__de_Vuelo__DocumentacionComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Coord__de_Vuelo__DocumentacionComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Coord__de_Vuelo__DocumentacionComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterCoord__de_Vuelo__DocumentacionComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Coord__de_Vuelo__DocumentacionRoutingModule {
 }

