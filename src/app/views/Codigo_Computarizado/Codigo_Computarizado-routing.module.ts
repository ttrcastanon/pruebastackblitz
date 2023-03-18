import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from '../../shared/services/auth-guard.service';
import { Codigo_ComputarizadoComponent } from './Codigo_Computarizado-add-edit/Codigo_Computarizado.component';
import { ListCodigo_ComputarizadoComponent } from './list-Codigo_Computarizado/list-Codigo_Computarizado.component';
import { ShowAdvanceFilterCodigo_ComputarizadoComponent } from './show-advance-filter-Codigo_Computarizado/show-advance-filter-Codigo_Computarizado.component';


const routes: Routes = [
  {
    path: 'list',
    component: ListCodigo_ComputarizadoComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Codigo_ComputarizadoComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Codigo_ComputarizadoComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Codigo_ComputarizadoComponent,
    canActivate: [AuthGuardService],
    data: { readOnly: true }
  },
  {
    path: 'showadvancefilter',
    component: ShowAdvanceFilterCodigo_ComputarizadoComponent,
    canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Codigo_ComputarizadoRoutingModule {
}

