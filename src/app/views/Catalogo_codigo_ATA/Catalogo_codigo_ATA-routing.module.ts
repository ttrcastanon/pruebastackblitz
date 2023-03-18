import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { Catalogo_codigo_ATAComponent } from './Catalogo_codigo_ATA-add-edit/Catalogo_codigo_ATA.component';
import { ListCatalogo_codigo_ATAComponent } from './list-Catalogo_codigo_ATA/list-Catalogo_codigo_ATA.component';
import { ShowAdvanceFilterCatalogo_codigo_ATAComponent } from './show-advance-filter-Catalogo_codigo_ATA/show-advance-filter-Catalogo_codigo_ATA.component';


const routes: Routes = [
  {
    path: 'list',
     component: ListCatalogo_codigo_ATAComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: Catalogo_codigo_ATAComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: Catalogo_codigo_ATAComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: Catalogo_codigo_ATAComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterCatalogo_codigo_ATAComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class Catalogo_codigo_ATARoutingModule {
 }

