import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { PaisComponent } from './Pais-add-edit/Pais.component';
import { ListPaisComponent } from './list-Pais/list-Pais.component';
import { ShowAdvanceFilterPaisComponent } from './show-advance-filter-Pais/show-advance-filter-Pais.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListPaisComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: PaisComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: PaisComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: PaisComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterPaisComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class PaisRoutingModule {
 }

