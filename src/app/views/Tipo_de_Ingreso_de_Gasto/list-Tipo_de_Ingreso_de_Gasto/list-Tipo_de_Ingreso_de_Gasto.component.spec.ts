import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTipo_de_Ingreso_de_GastoComponent } from './list-Tipo_de_Ingreso_de_Gasto.component';

describe('ListTipo_de_Ingreso_de_GastoComponent', () => {
  let component: ListTipo_de_Ingreso_de_GastoComponent;
  let fixture: ComponentFixture<ListTipo_de_Ingreso_de_GastoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListTipo_de_Ingreso_de_GastoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListTipo_de_Ingreso_de_GastoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
