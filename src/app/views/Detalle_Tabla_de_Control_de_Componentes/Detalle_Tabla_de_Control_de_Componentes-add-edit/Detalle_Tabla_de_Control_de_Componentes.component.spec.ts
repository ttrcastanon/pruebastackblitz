import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Detalle_Tabla_de_Control_de_ComponentesComponent } from './Detalle_Tabla_de_Control_de_Componentes.component';

describe('Detalle_Tabla_de_Control_de_ComponentesComponent', () => {
  let component: Detalle_Tabla_de_Control_de_ComponentesComponent;
  let fixture: ComponentFixture<Detalle_Tabla_de_Control_de_ComponentesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Detalle_Tabla_de_Control_de_ComponentesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Detalle_Tabla_de_Control_de_ComponentesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

