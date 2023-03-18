import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Politica_de_ProveedoresComponent } from './Politica_de_Proveedores-add-edit/Politica_de_Proveedores.component';
import { ListPolitica_de_ProveedoresComponent } from './list-Politica_de_Proveedores/list-Politica_de_Proveedores.component';
import { ShowAdvanceFilterPolitica_de_ProveedoresComponent } from './show-advance-filter-Politica_de_Proveedores/show-advance-filter-Politica_de_Proveedores.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListPolitica_de_ProveedoresComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Politica_de_ProveedoresComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Politica_de_ProveedoresComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Politica_de_ProveedoresComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterPolitica_de_ProveedoresComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Politica_de_ProveedoresRoutingModule {
 }

