import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Tipo_de_Equipo_de_EmergenciaComponent } from './Tipo_de_Equipo_de_Emergencia.component';

describe('Tipo_de_Equipo_de_EmergenciaComponent', () => {
  let component: Tipo_de_Equipo_de_EmergenciaComponent;
  let fixture: ComponentFixture<Tipo_de_Equipo_de_EmergenciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Tipo_de_Equipo_de_EmergenciaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Tipo_de_Equipo_de_EmergenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

