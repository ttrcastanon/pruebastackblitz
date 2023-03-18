import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Detalle_Cursos_PasajerosComponent } from './Detalle_Cursos_Pasajeros.component';

describe('Detalle_Cursos_PasajerosComponent', () => {
  let component: Detalle_Cursos_PasajerosComponent;
  let fixture: ComponentFixture<Detalle_Cursos_PasajerosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Detalle_Cursos_PasajerosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Detalle_Cursos_PasajerosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

