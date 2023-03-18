import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Cat__reportes_prestablecidosComponent } from './Cat__reportes_prestablecidos-add-edit/Cat__reportes_prestablecidos.component';
import { ListCat__reportes_prestablecidosComponent } from './list-Cat__reportes_prestablecidos/list-Cat__reportes_prestablecidos.component';
import { ShowAdvanceFilterCat__reportes_prestablecidosComponent } from './show-advance-filter-Cat__reportes_prestablecidos/show-advance-filter-Cat__reportes_prestablecidos.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListCat__reportes_prestablecidosComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Cat__reportes_prestablecidosComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Cat__reportes_prestablecidosComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Cat__reportes_prestablecidosComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterCat__reportes_prestablecidosComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Cat__reportes_prestablecidosRoutingModule {
 }

