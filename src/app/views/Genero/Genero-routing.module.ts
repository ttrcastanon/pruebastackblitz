import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { GeneroComponent } from './Genero-add-edit/Genero.component';
import { ListGeneroComponent } from './list-Genero/list-Genero.component';
import { ShowAdvanceFilterGeneroComponent } from './show-advance-filter-Genero/show-advance-filter-Genero.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListGeneroComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: GeneroComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: GeneroComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: GeneroComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterGeneroComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class GeneroRoutingModule {
 }

