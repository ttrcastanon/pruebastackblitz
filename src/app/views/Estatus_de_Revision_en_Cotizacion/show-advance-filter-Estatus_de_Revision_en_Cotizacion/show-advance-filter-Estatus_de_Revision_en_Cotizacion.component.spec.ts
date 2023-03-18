import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterEstatus_de_Revision_en_CotizacionComponent } from './show-advance-filter-Estatus_de_Revision_en_Cotizacion.component';

describe('ShowAdvanceFilterEstatus_de_Revision_en_CotizacionComponent', () => {
  let component: ShowAdvanceFilterEstatus_de_Revision_en_CotizacionComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterEstatus_de_Revision_en_CotizacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterEstatus_de_Revision_en_CotizacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterEstatus_de_Revision_en_CotizacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
