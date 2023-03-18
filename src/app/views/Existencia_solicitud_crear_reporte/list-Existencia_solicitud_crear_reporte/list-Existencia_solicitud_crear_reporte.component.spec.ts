import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListExistencia_solicitud_crear_reporteComponent } from './list-Existencia_solicitud_crear_reporte.component';

describe('ListExistencia_solicitud_crear_reporteComponent', () => {
  let component: ListExistencia_solicitud_crear_reporteComponent;
  let fixture: ComponentFixture<ListExistencia_solicitud_crear_reporteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListExistencia_solicitud_crear_reporteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListExistencia_solicitud_crear_reporteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
