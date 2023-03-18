import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuardService } from "src/app/shared/services/auth-guard.service";
import { ListDetalleReporteComponent } from "./list-detalle-reporte/list-detalle-reporte.component";
import { ListReporteGastosDeVueloComponent } from './list-reporte-gastos-de-vuelo/list-reporte-gastos-de-vuelo.component';

const routes: Routes = [
  {
    path: "list/:index",
    component: ListDetalleReporteComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: "DetailedReport/14",
    component: ListReporteGastosDeVueloComponent,
    canActivate: [AuthGuardService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetalleReporteRoutingModule { }
