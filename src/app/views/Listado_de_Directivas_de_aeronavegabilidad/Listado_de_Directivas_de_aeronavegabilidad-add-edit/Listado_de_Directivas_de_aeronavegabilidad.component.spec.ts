import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Listado_de_Directivas_de_aeronavegabilidadComponent } from './Listado_de_Directivas_de_aeronavegabilidad.component';

describe('Listado_de_Directivas_de_aeronavegabilidadComponent', () => {
  let component: Listado_de_Directivas_de_aeronavegabilidadComponent;
  let fixture: ComponentFixture<Listado_de_Directivas_de_aeronavegabilidadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Listado_de_Directivas_de_aeronavegabilidadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Listado_de_Directivas_de_aeronavegabilidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

