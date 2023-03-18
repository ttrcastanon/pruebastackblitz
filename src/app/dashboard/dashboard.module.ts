import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { MainComponent } from './main/main.component';
import { Dashboard2Component } from './dashboard2/dashboard2.component';
import { ChartsModule as chartjsModule } from 'ng2-charts';
import { NgxEchartsModule } from 'ngx-echarts';
import { NgApexchartsModule } from 'ng-apexcharts';
import { MorrisJsModule } from 'angular-morris-js';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {SharedModule} from '../shared/shared.module';
import { MatDialogModule } from '@angular/material/dialog';
import { CalendarioModule } from '../views/Calendario/calendario.module';

@NgModule({
  declarations: [MainComponent, Dashboard2Component],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    chartjsModule,
    NgxEchartsModule,
    MorrisJsModule,
    PerfectScrollbarModule,
    MatIconModule,
    NgApexchartsModule,
    MatButtonModule,
    SharedModule,
    MatDialogModule,
    CalendarioModule
  ],
})
export class DashboardModule {}
