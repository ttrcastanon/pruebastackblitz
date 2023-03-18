import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Registro_de_Distancia_SENEAMComponent } from './Registro_de_Distancia_SENEAM.component';

describe('Registro_de_Distancia_SENEAMComponent', () => {
  let component: Registro_de_Distancia_SENEAMComponent;
  let fixture: ComponentFixture<Registro_de_Distancia_SENEAMComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Registro_de_Distancia_SENEAMComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Registro_de_Distancia_SENEAMComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

