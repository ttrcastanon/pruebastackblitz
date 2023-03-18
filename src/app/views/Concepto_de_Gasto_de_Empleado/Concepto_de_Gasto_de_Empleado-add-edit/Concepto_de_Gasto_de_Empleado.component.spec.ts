import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Concepto_de_Gasto_de_EmpleadoComponent } from './Concepto_de_Gasto_de_Empleado.component';

describe('Concepto_de_Gasto_de_EmpleadoComponent', () => {
  let component: Concepto_de_Gasto_de_EmpleadoComponent;
  let fixture: ComponentFixture<Concepto_de_Gasto_de_EmpleadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Concepto_de_Gasto_de_EmpleadoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Concepto_de_Gasto_de_EmpleadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

