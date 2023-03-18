import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Catalogo_serviciosComponent } from './Catalogo_servicios-add-edit/Catalogo_servicios.component';
import { ListCatalogo_serviciosComponent } from './list-Catalogo_servicios/list-Catalogo_servicios.component';
import { ShowAdvanceFilterCatalogo_serviciosComponent } from './show-advance-filter-Catalogo_servicios/show-advance-filter-Catalogo_servicios.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListCatalogo_serviciosComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Catalogo_serviciosComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Catalogo_serviciosComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Catalogo_serviciosComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterCatalogo_serviciosComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Catalogo_serviciosRoutingModule {
 }

