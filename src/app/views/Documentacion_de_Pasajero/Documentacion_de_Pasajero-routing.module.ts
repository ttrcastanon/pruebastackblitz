import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Documentacion_de_PasajeroComponent } from './Documentacion_de_Pasajero-add-edit/Documentacion_de_Pasajero.component';
import { ListDocumentacion_de_PasajeroComponent } from './list-Documentacion_de_Pasajero/list-Documentacion_de_Pasajero.component';
import { ShowAdvanceFilterDocumentacion_de_PasajeroComponent } from './show-advance-filter-Documentacion_de_Pasajero/show-advance-filter-Documentacion_de_Pasajero.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListDocumentacion_de_PasajeroComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Documentacion_de_PasajeroComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Documentacion_de_PasajeroComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Documentacion_de_PasajeroComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterDocumentacion_de_PasajeroComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Documentacion_de_PasajeroRoutingModule {
 }

