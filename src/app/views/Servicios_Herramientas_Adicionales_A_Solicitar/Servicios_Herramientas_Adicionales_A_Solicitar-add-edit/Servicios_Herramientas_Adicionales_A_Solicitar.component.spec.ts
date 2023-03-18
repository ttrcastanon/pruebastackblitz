import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Servicios_Herramientas_Adicionales_A_SolicitarComponent } from './Servicios_Herramientas_Adicionales_A_Solicitar.component';

describe('Servicios_Herramientas_Adicionales_A_SolicitarComponent', () => {
  let component: Servicios_Herramientas_Adicionales_A_SolicitarComponent;
  let fixture: ComponentFixture<Servicios_Herramientas_Adicionales_A_SolicitarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Servicios_Herramientas_Adicionales_A_SolicitarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Servicios_Herramientas_Adicionales_A_SolicitarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

