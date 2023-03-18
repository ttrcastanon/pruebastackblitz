import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterRespuesta_del_Cliente_a_CotizacionComponent } from './show-advance-filter-Respuesta_del_Cliente_a_Cotizacion.component';

describe('ShowAdvanceFilterRespuesta_del_Cliente_a_CotizacionComponent', () => {
  let component: ShowAdvanceFilterRespuesta_del_Cliente_a_CotizacionComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterRespuesta_del_Cliente_a_CotizacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterRespuesta_del_Cliente_a_CotizacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterRespuesta_del_Cliente_a_CotizacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
