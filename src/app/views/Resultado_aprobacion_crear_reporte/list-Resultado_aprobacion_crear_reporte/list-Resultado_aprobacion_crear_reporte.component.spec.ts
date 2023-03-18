import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListResultado_aprobacion_crear_reporteComponent } from './list-Resultado_aprobacion_crear_reporte.component';

describe('ListResultado_aprobacion_crear_reporteComponent', () => {
  let component: ListResultado_aprobacion_crear_reporteComponent;
  let fixture: ComponentFixture<ListResultado_aprobacion_crear_reporteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListResultado_aprobacion_crear_reporteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListResultado_aprobacion_crear_reporteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
