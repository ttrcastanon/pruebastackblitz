import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterResultado_aprobacion_crear_reporteComponent } from './show-advance-filter-Resultado_aprobacion_crear_reporte.component';

describe('ShowAdvanceFilterResultado_aprobacion_crear_reporteComponent', () => {
  let component: ShowAdvanceFilterResultado_aprobacion_crear_reporteComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterResultado_aprobacion_crear_reporteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterResultado_aprobacion_crear_reporteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterResultado_aprobacion_crear_reporteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
