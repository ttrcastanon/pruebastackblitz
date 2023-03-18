import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Configuracion_de_tecnicos_e_inspectoresComponent } from './Configuracion_de_tecnicos_e_inspectores.component';

describe('Configuracion_de_tecnicos_e_inspectoresComponent', () => {
  let component: Configuracion_de_tecnicos_e_inspectoresComponent;
  let fixture: ComponentFixture<Configuracion_de_tecnicos_e_inspectoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Configuracion_de_tecnicos_e_inspectoresComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Configuracion_de_tecnicos_e_inspectoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

