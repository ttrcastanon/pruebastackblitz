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

import { Categorias_y_Documentos_Requeridos_de_PartesRoutingModule } from '../Categorias_y_Documentos_Requeridos_de_Partes/Categorias_y_Documentos_Requeridos_de_Partes-routing.module';
import { SharedModule } from './../../shared/shared.module';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Categorias_y_Documentos_Requeridos_de_PartesComponent } from './Categorias_y_Documentos_Requeridos_de_Partes-add-edit/Categorias_y_Documentos_Requeridos_de_Partes.component';
import { ListCategorias_y_Documentos_Requeridos_de_PartesComponent } from './list-Categorias_y_Documentos_Requeridos_de_Partes/list-Categorias_y_Documentos_Requeridos_de_Partes.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatRippleModule } from '@angular/material/core';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ShowAdvanceFilterCategorias_y_Documentos_Requeridos_de_PartesComponent } from './show-advance-filter-Categorias_y_Documentos_Requeridos_de_Partes/show-advance-filter-Categorias_y_Documentos_Requeridos_de_Partes.component';
import { MatRadioModule } from '@angular/material/radio';

import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { getDutchPaginatorIntl } from './../../shared/base-views/dutch-paginator-intl';

@NgModule({
  declarations: [Categorias_y_Documentos_Requeridos_de_PartesComponent,
    ListCategorias_y_Documentos_Requeridos_de_PartesComponent,
    ShowAdvanceFilterCategorias_y_Documentos_Requeridos_de_PartesComponent],
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
    Categorias_y_Documentos_Requeridos_de_PartesRoutingModule,
    NgxSpinnerModule,
    MatRadioModule,
  ],
  providers: [
    { provide: MatPaginatorIntl, useValue: getDutchPaginatorIntl() }
  ]
})
export class Categorias_y_Documentos_Requeridos_de_PartesModule { }

