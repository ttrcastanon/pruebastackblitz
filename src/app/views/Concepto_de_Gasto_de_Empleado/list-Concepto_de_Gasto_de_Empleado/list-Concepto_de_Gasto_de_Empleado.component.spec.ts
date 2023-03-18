import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListConcepto_de_Gasto_de_EmpleadoComponent } from './list-Concepto_de_Gasto_de_Empleado.component';

describe('ListConcepto_de_Gasto_de_EmpleadoComponent', () => {
  let component: ListConcepto_de_Gasto_de_EmpleadoComponent;
  let fixture: ComponentFixture<ListConcepto_de_Gasto_de_EmpleadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListConcepto_de_Gasto_de_EmpleadoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListConcepto_de_Gasto_de_EmpleadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
