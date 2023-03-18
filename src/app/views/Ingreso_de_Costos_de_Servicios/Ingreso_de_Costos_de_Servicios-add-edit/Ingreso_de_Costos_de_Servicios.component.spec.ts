import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Ingreso_de_Costos_de_ServiciosComponent } from './Ingreso_de_Costos_de_Servicios.component';

describe('Ingreso_de_Costos_de_ServiciosComponent', () => {
  let component: Ingreso_de_Costos_de_ServiciosComponent;
  let fixture: ComponentFixture<Ingreso_de_Costos_de_ServiciosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Ingreso_de_Costos_de_ServiciosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Ingreso_de_Costos_de_ServiciosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

