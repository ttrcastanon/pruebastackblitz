import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAyuda_de_respuesta_crear_reporteComponent } from './list-Ayuda_de_respuesta_crear_reporte.component';

describe('ListAyuda_de_respuesta_crear_reporteComponent', () => {
  let component: ListAyuda_de_respuesta_crear_reporteComponent;
  let fixture: ComponentFixture<ListAyuda_de_respuesta_crear_reporteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListAyuda_de_respuesta_crear_reporteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListAyuda_de_respuesta_crear_reporteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
