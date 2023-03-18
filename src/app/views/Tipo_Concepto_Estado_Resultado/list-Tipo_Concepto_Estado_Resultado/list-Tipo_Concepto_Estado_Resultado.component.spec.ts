import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTipo_Concepto_Estado_ResultadoComponent } from './list-Tipo_Concepto_Estado_Resultado.component';

describe('ListTipo_Concepto_Estado_ResultadoComponent', () => {
  let component: ListTipo_Concepto_Estado_ResultadoComponent;
  let fixture: ComponentFixture<ListTipo_Concepto_Estado_ResultadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListTipo_Concepto_Estado_ResultadoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListTipo_Concepto_Estado_ResultadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
