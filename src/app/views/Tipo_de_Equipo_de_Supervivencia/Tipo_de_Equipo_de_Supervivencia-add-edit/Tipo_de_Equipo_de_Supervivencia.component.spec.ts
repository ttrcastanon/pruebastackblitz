import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Tipo_de_Equipo_de_SupervivenciaComponent } from './Tipo_de_Equipo_de_Supervivencia.component';

describe('Tipo_de_Equipo_de_SupervivenciaComponent', () => {
  let component: Tipo_de_Equipo_de_SupervivenciaComponent;
  let fixture: ComponentFixture<Tipo_de_Equipo_de_SupervivenciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Tipo_de_Equipo_de_SupervivenciaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Tipo_de_Equipo_de_SupervivenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

