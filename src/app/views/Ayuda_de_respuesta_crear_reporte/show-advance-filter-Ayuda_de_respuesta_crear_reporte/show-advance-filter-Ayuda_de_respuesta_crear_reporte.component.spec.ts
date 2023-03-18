import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterAyuda_de_respuesta_crear_reporteComponent } from './show-advance-filter-Ayuda_de_respuesta_crear_reporte.component';

describe('ShowAdvanceFilterAyuda_de_respuesta_crear_reporteComponent', () => {
  let component: ShowAdvanceFilterAyuda_de_respuesta_crear_reporteComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterAyuda_de_respuesta_crear_reporteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterAyuda_de_respuesta_crear_reporteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterAyuda_de_respuesta_crear_reporteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
