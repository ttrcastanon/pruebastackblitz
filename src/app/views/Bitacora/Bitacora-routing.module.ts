import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { BitacoraComponent } from './Bitacora-add-edit/Bitacora.component';
import { ListBitacoraComponent } from './list-Bitacora/list-Bitacora.component';
import { ShowAdvanceFilterBitacoraComponent } from './show-advance-filter-Bitacora/show-advance-filter-Bitacora.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListBitacoraComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: BitacoraComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: BitacoraComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: BitacoraComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterBitacoraComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class BitacoraRoutingModule {
 }

