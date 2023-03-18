import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Existencia_solicitud_crear_reporteComponent } from './Existencia_solicitud_crear_reporte.component';

describe('Existencia_solicitud_crear_reporteComponent', () => {
  let component: Existencia_solicitud_crear_reporteComponent;
  let fixture: ComponentFixture<Existencia_solicitud_crear_reporteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Existencia_solicitud_crear_reporteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Existencia_solicitud_crear_reporteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

