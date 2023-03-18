import { SpartanService } from './api-services/spartan.service';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './layout/header/header.component';
import { PageLoaderComponent } from './layout/page-loader/page-loader.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { RightSidebarComponent } from './layout/right-sidebar/right-sidebar.component';
import { LocationStrategy, HashLocationStrategy, DatePipe } from '@angular/common';
import { DynamicScriptLoaderService } from './shared/services/dynamic-script-loader.service';
import { ConfigService } from './shared/services/config.service';
import { RightSidebarService } from './shared/services/rightsidebar.service';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MatPaginatorModule } from '@angular/material/paginator';
import { PerfectScrollbarModule, PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface, } from 'ngx-perfect-scrollbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { NgxMaskModule } from 'ngx-mask';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDialogModule } from '@angular/material/dialog';
import { SimpleDialogComponent } from './ui/modal/simpleDialog.component';
import { DialogformComponent } from './ui/modal/dialogform/dialogform.component';
import { BottomSheetOverviewExampleSheet } from './ui/bottom-sheet/bottom-sheet.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AgmCoreModule } from '@agm/core';
import { ClickOutsideModule } from 'ng-click-outside';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgxMatDatetimePickerModule, NgxMatNativeDateModule, NgxMatTimepickerModule, } from '@angular-material-components/datetime-picker';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { APP_CONFIG, GLOBAL_CONFIG } from './app.config';
import { MY_DATE_FORMATS, FILE_INPUT_CONFIG } from './app-constants';
import { NGX_MAT_FILE_INPUT_CONFIG } from 'ngx-material-file-input';
import { SpartaneInterceptorService } from './shared/services/spartane-interceptor.service';
import { MatRadioModule } from '@angular/material/radio';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTabsModule } from '@angular/material/tabs';
import { NgSelectModule } from '@ng-select/ng-select';
//import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import { CierreSessionInactividadComponent } from '../app/views/Cierre_Session_Inactividad/cierre-session-inactividad.component';
import { NgIdleModule } from '@ng-idle/core'

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
  wheelPropagation: false,
};

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    PageLoaderComponent,
    SidebarComponent,
    RightSidebarComponent,
    SimpleDialogComponent,
    DialogformComponent,
    BottomSheetOverviewExampleSheet,
    CierreSessionInactividadComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    NgbModule,
    HttpClientModule,
    ReactiveFormsModule,
    PerfectScrollbarModule,
    MatIconModule,
    MatButtonModule,
    MatProgressBarModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatListModule,
    MatSidenavModule,
    MatButtonToggleModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    MatMenuModule,
    MatRadioModule,
    MatBadgeModule,
    ClickOutsideModule,
    NgxMatDatetimePickerModule,
    NgxMatNativeDateModule,
    NgxMatTimepickerModule,
    MatTabsModule,
    NgxSpinnerModule,
    MatPaginatorModule,
    NgSelectModule,
    NgIdleModule.forRoot(),
    NgxMaskModule.forRoot(),
    AgmCoreModule.forRoot({
      apiKey: 'YOUR API KEY',
    }),
    TranslateModule.forRoot({
      defaultLanguage: 'es',
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    { provide: APP_CONFIG, useValue: GLOBAL_CONFIG },
    { provide: PERFECT_SCROLLBAR_CONFIG, useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: MY_DATE_FORMATS },
    { provide: NGX_MAT_FILE_INPUT_CONFIG, useValue: FILE_INPUT_CONFIG },
    { provide: HTTP_INTERCEPTORS, useClass: SpartaneInterceptorService, multi: true },
    DynamicScriptLoaderService,
    ConfigService,
    RightSidebarService,
    DatePipe,
    SpartanService
  ],
  entryComponents: [
    SimpleDialogComponent,
    DialogformComponent,
    BottomSheetOverviewExampleSheet
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
