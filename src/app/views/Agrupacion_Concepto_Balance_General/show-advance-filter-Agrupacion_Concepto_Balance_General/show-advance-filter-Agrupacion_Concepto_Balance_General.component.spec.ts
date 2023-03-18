import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterAgrupacion_Concepto_Balance_GeneralComponent } from './show-advance-filter-Agrupacion_Concepto_Balance_General.component';

describe('ShowAdvanceFilterAgrupacion_Concepto_Balance_GeneralComponent', () => {
  let component: ShowAdvanceFilterAgrupacion_Concepto_Balance_GeneralComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterAgrupacion_Concepto_Balance_GeneralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterAgrupacion_Concepto_Balance_GeneralComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterAgrupacion_Concepto_Balance_GeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
