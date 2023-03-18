import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterConfiguracion_de_NotificacionComponent } from './show-advance-filter-Configuracion_de_Notificacion.component';

describe('ShowAdvanceFilterConfiguracion_de_NotificacionComponent', () => {
  let component: ShowAdvanceFilterConfiguracion_de_NotificacionComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterConfiguracion_de_NotificacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterConfiguracion_de_NotificacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterConfiguracion_de_NotificacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
