import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Causa_de_remocionComponent } from './Causa_de_remocion-add-edit/Causa_de_remocion.component';
import { ListCausa_de_remocionComponent } from './list-Causa_de_remocion/list-Causa_de_remocion.component';
import { ShowAdvanceFilterCausa_de_remocionComponent } from './show-advance-filter-Causa_de_remocion/show-advance-filter-Causa_de_remocion.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListCausa_de_remocionComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Causa_de_remocionComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Causa_de_remocionComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Causa_de_remocionComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterCausa_de_remocionComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Causa_de_remocionRoutingModule {
 }

