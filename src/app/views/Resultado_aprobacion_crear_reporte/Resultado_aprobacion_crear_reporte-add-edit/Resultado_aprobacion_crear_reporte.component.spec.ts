import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Resultado_aprobacion_crear_reporteComponent } from './Resultado_aprobacion_crear_reporte.component';

describe('Resultado_aprobacion_crear_reporteComponent', () => {
  let component: Resultado_aprobacion_crear_reporteComponent;
  let fixture: ComponentFixture<Resultado_aprobacion_crear_reporteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Resultado_aprobacion_crear_reporteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Resultado_aprobacion_crear_reporteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

