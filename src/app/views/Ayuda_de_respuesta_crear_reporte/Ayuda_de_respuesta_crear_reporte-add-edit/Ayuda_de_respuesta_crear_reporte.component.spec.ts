import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Ayuda_de_respuesta_crear_reporteComponent } from './Ayuda_de_respuesta_crear_reporte.component';

describe('Ayuda_de_respuesta_crear_reporteComponent', () => {
  let component: Ayuda_de_respuesta_crear_reporteComponent;
  let fixture: ComponentFixture<Ayuda_de_respuesta_crear_reporteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Ayuda_de_respuesta_crear_reporteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Ayuda_de_respuesta_crear_reporteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

