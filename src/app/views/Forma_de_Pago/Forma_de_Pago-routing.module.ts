import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Forma_de_PagoComponent } from './Forma_de_Pago-add-edit/Forma_de_Pago.component';
import { ListForma_de_PagoComponent } from './list-Forma_de_Pago/list-Forma_de_Pago.component';
import { ShowAdvanceFilterForma_de_PagoComponent } from './show-advance-filter-Forma_de_Pago/show-advance-filter-Forma_de_Pago.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListForma_de_PagoComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Forma_de_PagoComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Forma_de_PagoComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Forma_de_PagoComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterForma_de_PagoComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Forma_de_PagoRoutingModule {
 }

