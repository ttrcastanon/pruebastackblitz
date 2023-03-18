import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterEstatus_de_CMP_a_CotizarComponent } from './show-advance-filter-Estatus_de_CMP_a_Cotizar.component';

describe('ShowAdvanceFilterEstatus_de_CMP_a_CotizarComponent', () => {
  let component: ShowAdvanceFilterEstatus_de_CMP_a_CotizarComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterEstatus_de_CMP_a_CotizarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterEstatus_de_CMP_a_CotizarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterEstatus_de_CMP_a_CotizarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
