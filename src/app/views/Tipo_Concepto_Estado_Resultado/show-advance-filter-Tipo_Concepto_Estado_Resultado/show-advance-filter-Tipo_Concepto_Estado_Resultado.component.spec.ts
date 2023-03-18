import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterTipo_Concepto_Estado_ResultadoComponent } from './show-advance-filter-Tipo_Concepto_Estado_Resultado.component';

describe('ShowAdvanceFilterTipo_Concepto_Estado_ResultadoComponent', () => {
  let component: ShowAdvanceFilterTipo_Concepto_Estado_ResultadoComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterTipo_Concepto_Estado_ResultadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterTipo_Concepto_Estado_ResultadoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterTipo_Concepto_Estado_ResultadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
