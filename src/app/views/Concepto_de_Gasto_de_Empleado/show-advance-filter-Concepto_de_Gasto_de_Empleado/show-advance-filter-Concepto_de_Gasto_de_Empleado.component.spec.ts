import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterConcepto_de_Gasto_de_EmpleadoComponent } from './show-advance-filter-Concepto_de_Gasto_de_Empleado.component';

describe('ShowAdvanceFilterConcepto_de_Gasto_de_EmpleadoComponent', () => {
  let component: ShowAdvanceFilterConcepto_de_Gasto_de_EmpleadoComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterConcepto_de_Gasto_de_EmpleadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterConcepto_de_Gasto_de_EmpleadoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterConcepto_de_Gasto_de_EmpleadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
