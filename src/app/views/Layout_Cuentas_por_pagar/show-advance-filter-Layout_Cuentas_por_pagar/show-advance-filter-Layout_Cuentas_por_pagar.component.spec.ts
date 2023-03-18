import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterLayout_Cuentas_por_pagarComponent } from './show-advance-filter-Layout_Cuentas_por_pagar.component';

describe('ShowAdvanceFilterLayout_Cuentas_por_pagarComponent', () => {
  let component: ShowAdvanceFilterLayout_Cuentas_por_pagarComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterLayout_Cuentas_por_pagarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterLayout_Cuentas_por_pagarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterLayout_Cuentas_por_pagarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
