import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterPre_Solicitud_de_CotizacionComponent } from './show-advance-filter-Pre_Solicitud_de_Cotizacion.component';

describe('ShowAdvanceFilterPre_Solicitud_de_CotizacionComponent', () => {
  let component: ShowAdvanceFilterPre_Solicitud_de_CotizacionComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterPre_Solicitud_de_CotizacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterPre_Solicitud_de_CotizacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterPre_Solicitud_de_CotizacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
