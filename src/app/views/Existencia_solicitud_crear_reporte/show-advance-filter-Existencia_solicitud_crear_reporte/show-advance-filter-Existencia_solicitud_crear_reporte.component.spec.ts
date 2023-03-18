import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterExistencia_solicitud_crear_reporteComponent } from './show-advance-filter-Existencia_solicitud_crear_reporte.component';

describe('ShowAdvanceFilterExistencia_solicitud_crear_reporteComponent', () => {
  let component: ShowAdvanceFilterExistencia_solicitud_crear_reporteComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterExistencia_solicitud_crear_reporteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterExistencia_solicitud_crear_reporteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterExistencia_solicitud_crear_reporteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
