import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Nivel_de_RuidoComponent } from './Nivel_de_Ruido-add-edit/Nivel_de_Ruido.component';
import { ListNivel_de_RuidoComponent } from './list-Nivel_de_Ruido/list-Nivel_de_Ruido.component';
import { ShowAdvanceFilterNivel_de_RuidoComponent } from './show-advance-filter-Nivel_de_Ruido/show-advance-filter-Nivel_de_Ruido.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListNivel_de_RuidoComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Nivel_de_RuidoComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Nivel_de_RuidoComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Nivel_de_RuidoComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterNivel_de_RuidoComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Nivel_de_RuidoRoutingModule {
 }

