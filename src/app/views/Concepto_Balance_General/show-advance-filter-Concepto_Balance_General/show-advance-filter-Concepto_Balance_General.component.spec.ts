import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterConcepto_Balance_GeneralComponent } from './show-advance-filter-Concepto_Balance_General.component';

describe('ShowAdvanceFilterConcepto_Balance_GeneralComponent', () => {
  let component: ShowAdvanceFilterConcepto_Balance_GeneralComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterConcepto_Balance_GeneralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterConcepto_Balance_GeneralComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterConcepto_Balance_GeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
