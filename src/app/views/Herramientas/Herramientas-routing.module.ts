import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { HerramientasComponent } from './Herramientas-add-edit/Herramientas.component';
import { ListHerramientasComponent } from './list-Herramientas/list-Herramientas.component';
import { ShowAdvanceFilterHerramientasComponent } from './show-advance-filter-Herramientas/show-advance-filter-Herramientas.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListHerramientasComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: HerramientasComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: HerramientasComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: HerramientasComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterHerramientasComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class HerramientasRoutingModule {
 }

