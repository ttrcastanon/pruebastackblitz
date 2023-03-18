import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Origen_de_AeronaveComponent } from './Origen_de_Aeronave-add-edit/Origen_de_Aeronave.component';
import { ListOrigen_de_AeronaveComponent } from './list-Origen_de_Aeronave/list-Origen_de_Aeronave.component';
import { ShowAdvanceFilterOrigen_de_AeronaveComponent } from './show-advance-filter-Origen_de_Aeronave/show-advance-filter-Origen_de_Aeronave.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListOrigen_de_AeronaveComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Origen_de_AeronaveComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Origen_de_AeronaveComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Origen_de_AeronaveComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterOrigen_de_AeronaveComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Origen_de_AeronaveRoutingModule {
 }

