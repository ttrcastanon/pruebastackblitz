import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Clasificacion_de_aeronavegabilidadComponent } from './Clasificacion_de_aeronavegabilidad.component';

describe('Clasificacion_de_aeronavegabilidadComponent', () => {
  let component: Clasificacion_de_aeronavegabilidadComponent;
  let fixture: ComponentFixture<Clasificacion_de_aeronavegabilidadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Clasificacion_de_aeronavegabilidadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Clasificacion_de_aeronavegabilidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

