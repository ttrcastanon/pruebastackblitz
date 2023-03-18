import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Boletines_Directivas_aeronavegatibilidadComponent } from './Boletines_Directivas_aeronavegatibilidad-add-edit/Boletines_Directivas_aeronavegatibilidad.component';
import { ListBoletines_Directivas_aeronavegatibilidadComponent } from './list-Boletines_Directivas_aeronavegatibilidad/list-Boletines_Directivas_aeronavegatibilidad.component';
import { ShowAdvanceFilterBoletines_Directivas_aeronavegatibilidadComponent } from './show-advance-filter-Boletines_Directivas_aeronavegatibilidad/show-advance-filter-Boletines_Directivas_aeronavegatibilidad.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListBoletines_Directivas_aeronavegatibilidadComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'list/:id',
     component: ListBoletines_Directivas_aeronavegatibilidadComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Boletines_Directivas_aeronavegatibilidadComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Boletines_Directivas_aeronavegatibilidadComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Boletines_Directivas_aeronavegatibilidadComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterBoletines_Directivas_aeronavegatibilidadComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Boletines_Directivas_aeronavegatibilidadRoutingModule {
 }

