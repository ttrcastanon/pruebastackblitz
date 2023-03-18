import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterConcepto_de_Gasto_de_AeronaveComponent } from './show-advance-filter-Concepto_de_Gasto_de_Aeronave.component';

describe('ShowAdvanceFilterConcepto_de_Gasto_de_AeronaveComponent', () => {
  let component: ShowAdvanceFilterConcepto_de_Gasto_de_AeronaveComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterConcepto_de_Gasto_de_AeronaveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterConcepto_de_Gasto_de_AeronaveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterConcepto_de_Gasto_de_AeronaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
