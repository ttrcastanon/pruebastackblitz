import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Lista_PredeterminadaComponent } from './Lista_Predeterminada-add-edit/Lista_Predeterminada.component';
import { ListLista_PredeterminadaComponent } from './list-Lista_Predeterminada/list-Lista_Predeterminada.component';
import { ShowAdvanceFilterLista_PredeterminadaComponent } from './show-advance-filter-Lista_Predeterminada/show-advance-filter-Lista_Predeterminada.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListLista_PredeterminadaComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Lista_PredeterminadaComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Lista_PredeterminadaComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Lista_PredeterminadaComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterLista_PredeterminadaComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Lista_PredeterminadaRoutingModule {
 }

