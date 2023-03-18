import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { AeronaveComponent } from './Aeronave-add-edit/Aeronave.component';
import { ListAeronaveComponent } from './list-Aeronave/list-Aeronave.component';
import { ShowAdvanceFilterAeronaveComponent } from './show-advance-filter-Aeronave/show-advance-filter-Aeronave.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListAeronaveComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: AeronaveComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: AeronaveComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: AeronaveComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterAeronaveComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class AeronaveRoutingModule {
 }

