import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Concepto_Estado_de_ResultadoComponent } from './Concepto_Estado_de_Resultado.component';

describe('Concepto_Estado_de_ResultadoComponent', () => {
  let component: Concepto_Estado_de_ResultadoComponent;
  let fixture: ComponentFixture<Concepto_Estado_de_ResultadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Concepto_Estado_de_ResultadoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Concepto_Estado_de_ResultadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

