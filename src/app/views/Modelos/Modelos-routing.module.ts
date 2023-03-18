import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from '../../shared/services/auth-guard.service';
import { ModelosComponent } from './Modelos-add-edit/Modelos.component';
import { ListModelosComponent } from './list-Modelos/list-Modelos.component';
import { ShowAdvanceFilterModelosComponent } from './show-advance-filter-Modelos/show-advance-filter-Modelos.component';


const routes: Routes = [
  {
    path: 'list',
    component: ListModelosComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: ModelosComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: ModelosComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: ModelosComponent,
    canActivate: [AuthGuardService],
    data: { readOnly: true }
  },
  {
    path: 'showadvancefilter',
    component: ShowAdvanceFilterModelosComponent,
    canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class ModelosRoutingModule {
}

