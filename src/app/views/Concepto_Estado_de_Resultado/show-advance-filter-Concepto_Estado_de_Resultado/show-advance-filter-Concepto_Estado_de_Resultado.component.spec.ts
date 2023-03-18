import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterConcepto_Estado_de_ResultadoComponent } from './show-advance-filter-Concepto_Estado_de_Resultado.component';

describe('ShowAdvanceFilterConcepto_Estado_de_ResultadoComponent', () => {
  let component: ShowAdvanceFilterConcepto_Estado_de_ResultadoComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterConcepto_Estado_de_ResultadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterConcepto_Estado_de_ResultadoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterConcepto_Estado_de_ResultadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
