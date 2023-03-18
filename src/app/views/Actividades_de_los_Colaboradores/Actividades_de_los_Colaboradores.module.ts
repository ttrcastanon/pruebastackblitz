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

import { Actividades_de_los_ColaboradoresRoutingModule } from '../Actividades_de_los_Colaboradores/Actividades_de_los_Colaboradores-routing.module';
import { SharedModule } from './../../shared/shared.module';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Actividades_de_los_ColaboradoresComponent } from './Actividades_de_los_Colaboradores-add-edit/Actividades_de_los_Colaboradores.component';
import { ListActividades_de_los_ColaboradoresComponent } from './list-Actividades_de_los_Colaboradores/list-Actividades_de_los_Colaboradores.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatRippleModule } from '@angular/material/core';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ShowAdvanceFilterActividades_de_los_ColaboradoresComponent } from './show-advance-filter-Actividades_de_los_Colaboradores/show-advance-filter-Actividades_de_los_Colaboradores.component';
import { MatRadioModule } from '@angular/material/radio';

import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { getDutchPaginatorIntl } from './../../shared/base-views/dutch-paginator-intl';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatChipsModule } from '@angular/material/chips';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@NgModule({
  declarations: [Actividades_de_los_ColaboradoresComponent,
    ListActividades_de_los_ColaboradoresComponent,
    ShowAdvanceFilterActividades_de_los_ColaboradoresComponent],
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
    Actividades_de_los_ColaboradoresRoutingModule,
    NgxSpinnerModule,
    MatRadioModule,
    MatSidenavModule,
    MatChipsModule,
    MatSlideToggleModule
  ],
  providers: [
    { provide: MatPaginatorIntl, useValue: getDutchPaginatorIntl() }
  ]
})
export class Actividades_de_los_ColaboradoresModule { }

