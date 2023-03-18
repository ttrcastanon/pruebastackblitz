import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from '../../shared/services/auth-guard.service';
import { CotizacionComponent } from './Cotizacion-add-edit/Cotizacion.component';
import { ListCotizacionComponent } from './list-Cotizacion/list-Cotizacion.component';
import { ShowAdvanceFilterCotizacionComponent } from './show-advance-filter-Cotizacion/show-advance-filter-Cotizacion.component';


const routes: Routes = [
  {
    path: 'list/:phase',
     component: ListCotizacionComponent,
     canActivate: [AuthGuardService]
  },
  {
    path: 'add',
    component: CotizacionComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:id',
    component: CotizacionComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'consult/:id',
    component: CotizacionComponent,
    canActivate: [AuthGuardService],
    data: {readOnly: true}
  },
  {
    path: 'showadvancefilter',
     component: ShowAdvanceFilterCotizacionComponent,
     canActivate: [AuthGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class CotizacionRoutingModule {
 }

