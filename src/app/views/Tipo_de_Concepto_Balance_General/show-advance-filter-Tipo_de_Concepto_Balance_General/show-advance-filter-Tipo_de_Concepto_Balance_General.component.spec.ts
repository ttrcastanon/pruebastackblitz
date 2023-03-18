import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterTipo_de_Concepto_Balance_GeneralComponent } from './show-advance-filter-Tipo_de_Concepto_Balance_General.component';

describe('ShowAdvanceFilterTipo_de_Concepto_Balance_GeneralComponent', () => {
  let component: ShowAdvanceFilterTipo_de_Concepto_Balance_GeneralComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterTipo_de_Concepto_Balance_GeneralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterTipo_de_Concepto_Balance_GeneralComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterTipo_de_Concepto_Balance_GeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
