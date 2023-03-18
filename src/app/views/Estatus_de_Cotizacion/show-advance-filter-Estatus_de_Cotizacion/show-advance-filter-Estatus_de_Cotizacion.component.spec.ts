import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterEstatus_de_CotizacionComponent } from './show-advance-filter-Estatus_de_Cotizacion.component';

describe('ShowAdvanceFilterEstatus_de_CotizacionComponent', () => {
  let component: ShowAdvanceFilterEstatus_de_CotizacionComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterEstatus_de_CotizacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterEstatus_de_CotizacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterEstatus_de_CotizacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
