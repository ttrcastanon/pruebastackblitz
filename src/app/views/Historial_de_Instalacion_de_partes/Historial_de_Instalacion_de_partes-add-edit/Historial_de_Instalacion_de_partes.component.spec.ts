import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Historial_de_Instalacion_de_partesComponent } from './Historial_de_Instalacion_de_partes.component';

describe('Historial_de_Instalacion_de_partesComponent', () => {
  let component: Historial_de_Instalacion_de_partesComponent;
  let fixture: ComponentFixture<Historial_de_Instalacion_de_partesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Historial_de_Instalacion_de_partesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Historial_de_Instalacion_de_partesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

