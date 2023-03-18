import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterMotivo_de_Edicion_de_CotizacionComponent } from './show-advance-filter-Motivo_de_Edicion_de_Cotizacion.component';

describe('ShowAdvanceFilterMotivo_de_Edicion_de_CotizacionComponent', () => {
  let component: ShowAdvanceFilterMotivo_de_Edicion_de_CotizacionComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterMotivo_de_Edicion_de_CotizacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterMotivo_de_Edicion_de_CotizacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterMotivo_de_Edicion_de_CotizacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
