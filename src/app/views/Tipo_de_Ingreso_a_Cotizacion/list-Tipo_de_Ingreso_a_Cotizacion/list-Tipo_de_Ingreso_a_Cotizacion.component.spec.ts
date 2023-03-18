import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTipo_de_Ingreso_a_CotizacionComponent } from './list-Tipo_de_Ingreso_a_Cotizacion.component';

describe('ListTipo_de_Ingreso_a_CotizacionComponent', () => {
  let component: ListTipo_de_Ingreso_a_CotizacionComponent;
  let fixture: ComponentFixture<ListTipo_de_Ingreso_a_CotizacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListTipo_de_Ingreso_a_CotizacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListTipo_de_Ingreso_a_CotizacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
