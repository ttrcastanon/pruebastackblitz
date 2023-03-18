import { NgxSpinnerModule } from 'ngx-spinner';
import { NgModule, LOCALE_ID } from '@angular/core';
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

import { Registro_de_vueloRoutingModule } from '../Registro_de_vuelo/Registro_de_vuelo-routing.module';
import { SharedModule } from './../../shared/shared.module';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Registro_de_vueloComponent } from './Registro_de_vuelo-add-edit/Registro_de_vuelo.component';
import { ModalRegistroDeVueloComponent } from './modal-Registro_de_vuelo/modal-Registro_de_vuelo.component';
import { ListRegistro_de_vueloComponent } from './list-Registro_de_vuelo/list-Registro_de_vuelo.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatRippleModule } from '@angular/material/core';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ShowAdvanceFilterRegistro_de_vueloComponent } from './show-advance-filter-Registro_de_vuelo/show-advance-filter-Registro_de_vuelo.component';
import { MatRadioModule } from '@angular/material/radio';

import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { getDutchPaginatorIntl } from './../../shared/base-views/dutch-paginator-intl';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import localePy from '@angular/common/locales/es-PY';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';

registerLocaleData(localeEs, 'es');
registerLocaleData(localePy, 'es');

@NgModule({
  declarations: [
    Registro_de_vueloComponent,
    ListRegistro_de_vueloComponent,
    ShowAdvanceFilterRegistro_de_vueloComponent,
    ModalRegistroDeVueloComponent,
  ],
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
    Registro_de_vueloRoutingModule,
    NgxSpinnerModule,
    MatRadioModule,
  ],
  providers: [
    { provide: MatPaginatorIntl, useValue: getDutchPaginatorIntl() },
    { provide: LOCALE_ID, useValue: 'es' }
  ]
})
export class Registro_de_vueloModule { }

