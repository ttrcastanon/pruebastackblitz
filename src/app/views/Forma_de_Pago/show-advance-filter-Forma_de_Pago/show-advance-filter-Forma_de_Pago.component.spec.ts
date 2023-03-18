import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterForma_de_PagoComponent } from './show-advance-filter-Forma_de_Pago.component';

describe('ShowAdvanceFilterForma_de_PagoComponent', () => {
  let component: ShowAdvanceFilterForma_de_PagoComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterForma_de_PagoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterForma_de_PagoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterForma_de_PagoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
