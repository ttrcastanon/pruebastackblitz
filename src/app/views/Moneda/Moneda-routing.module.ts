import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { MonedaComponent } from './Moneda-add-edit/Moneda.component';
import { ListMonedaComponent } from './list-Moneda/list-Moneda.component';
import { ShowAdvanceFilterMonedaComponent } from './show-advance-filter-Moneda/show-advance-filter-Moneda.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListMonedaComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: MonedaComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: MonedaComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: MonedaComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterMonedaComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class MonedaRoutingModule {
 }

