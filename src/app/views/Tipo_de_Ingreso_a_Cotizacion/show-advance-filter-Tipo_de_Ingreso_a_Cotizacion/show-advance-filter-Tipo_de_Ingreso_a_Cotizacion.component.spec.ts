import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterTipo_de_Ingreso_a_CotizacionComponent } from './show-advance-filter-Tipo_de_Ingreso_a_Cotizacion.component';

describe('ShowAdvanceFilterTipo_de_Ingreso_a_CotizacionComponent', () => {
  let component: ShowAdvanceFilterTipo_de_Ingreso_a_CotizacionComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterTipo_de_Ingreso_a_CotizacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterTipo_de_Ingreso_a_CotizacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterTipo_de_Ingreso_a_CotizacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
