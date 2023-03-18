import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterCMP_a_CotizarComponent } from './show-advance-filter-CMP_a_Cotizar.component';

describe('ShowAdvanceFilterCMP_a_CotizarComponent', () => {
  let component: ShowAdvanceFilterCMP_a_CotizarComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterCMP_a_CotizarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterCMP_a_CotizarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterCMP_a_CotizarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
