﻿import { NgxSpinnerModule } from 'ngx-spinner';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSortModule } from '@angular/material/sort';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MaterialFileInputModule } from 'ngx-material-file-input';
import { MatTabsModule } from '@angular/material/tabs';
import { MatMenuModule } from '@angular/material/menu';

import { Configuracion_de_tecnicos_e_inspectoresRoutingModule } from '../Configuracion_de_tecnicos_e_inspectores/Configuracion_de_tecnicos_e_inspectores-routing.module';
import { SharedModule } from './../../shared/shared.module';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Configuracion_de_tecnicos_e_inspectoresComponent } from './Configuracion_de_tecnicos_e_inspectores-add-edit/Configuracion_de_tecnicos_e_inspectores.component';
import { ListConfiguracion_de_tecnicos_e_inspectoresComponent } from './list-Configuracion_de_tecnicos_e_inspectores/list-Configuracion_de_tecnicos_e_inspectores.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatRippleModule } from '@angular/material/core';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ShowAdvanceFilterConfiguracion_de_tecnicos_e_inspectoresComponent } from './show-advance-filter-Configuracion_de_tecnicos_e_inspectores/show-advance-filter-Configuracion_de_tecnicos_e_inspectores.component';
import { MatRadioModule } from '@angular/material/radio';

import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { getDutchPaginatorIntl } from './../../shared/base-views/dutch-paginator-intl';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';

@NgModule({
  declarations: [Configuracion_de_tecnicos_e_inspectoresComponent,
    ListConfiguracion_de_tecnicos_e_inspectoresComponent,
    ShowAdvanceFilterConfiguracion_de_tecnicos_e_inspectoresComponent],
  imports: [
    SharedModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxDatatableModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSortModule,
    MatToolbarModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    MatTabsModule,
    MaterialFileInputModule,
    CKEditorModule,
    SharedModule,
    MatTooltipModule,
    MatMenuModule,
    Configuracion_de_tecnicos_e_inspectoresRoutingModule,
    NgxSpinnerModule,
    MatRadioModule,
    MatDividerModule,
    MatListModule,
  ],
  providers: [
    { provide: MatPaginatorIntl, useValue: getDutchPaginatorIntl() }
  ]
})
export class Configuracion_de_tecnicos_e_inspectoresModule { }
