import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Tipo_Concepto_Estado_ResultadoComponent } from './Tipo_Concepto_Estado_Resultado.component';

describe('Tipo_Concepto_Estado_ResultadoComponent', () => {
  let component: Tipo_Concepto_Estado_ResultadoComponent;
  let fixture: ComponentFixture<Tipo_Concepto_Estado_ResultadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Tipo_Concepto_Estado_ResultadoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Tipo_Concepto_Estado_ResultadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

