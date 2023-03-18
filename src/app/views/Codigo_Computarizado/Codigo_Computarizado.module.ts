import { NgxSpinnerModule } from 'ngx-spinner';
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
import { Codigo_ComputarizadoRoutingModule } from '../Codigo_Computarizado/Codigo_Computarizado-routing.module';
import { SharedModule } from './../../shared/shared.module';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Codigo_ComputarizadoComponent } from './Codigo_Computarizado-add-edit/Codigo_Computarizado.component';
import { ListCodigo_ComputarizadoComponent } from './list-Codigo_Computarizado/list-Codigo_Computarizado.component';
import { MatTooltipModule } from '@angular/material/tooltip';

import { ShowAdvanceFilterCodigo_ComputarizadoComponent } from './show-advance-filter-Codigo_Computarizado/show-advance-filter-Codigo_Computarizado.component';
import { MatRadioModule } from '@angular/material/radio';

import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { getDutchPaginatorIntl } from './../../shared/base-views/dutch-paginator-intl';

import { AppMaterialModule } from './../../../assets/material/app-material.module';

@NgModule({
  declarations: [Codigo_ComputarizadoComponent,
    ListCodigo_ComputarizadoComponent,
    ShowAdvanceFilterCodigo_ComputarizadoComponent],
  imports: [
    CommonModule,
    Codigo_ComputarizadoRoutingModule,

    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    NgxDatatableModule,
    NgxSpinnerModule,
    CKEditorModule,
    MaterialFileInputModule,
    SharedModule,

    AppMaterialModule,

  ],
  providers: [
    { provide: MatPaginatorIntl, useValue: getDutchPaginatorIntl() }
  ]
})
export class Codigo_ComputarizadoModule { }

