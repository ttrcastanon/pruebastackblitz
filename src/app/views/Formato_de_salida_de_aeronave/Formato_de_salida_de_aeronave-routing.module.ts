import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Formato_de_salida_de_aeronaveComponent } from './Formato_de_salida_de_aeronave-add-edit/Formato_de_salida_de_aeronave.component';
import { ListFormato_de_salida_de_aeronaveComponent } from './list-Formato_de_salida_de_aeronave/list-Formato_de_salida_de_aeronave.component';
import { ShowAdvanceFilterFormato_de_salida_de_aeronaveComponent } from './show-advance-filter-Formato_de_salida_de_aeronave/show-advance-filter-Formato_de_salida_de_aeronave.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListFormato_de_salida_de_aeronaveComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Formato_de_salida_de_aeronaveComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Formato_de_salida_de_aeronaveComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Formato_de_salida_de_aeronaveComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterFormato_de_salida_de_aeronaveComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Formato_de_salida_de_aeronaveRoutingModule {
 }

