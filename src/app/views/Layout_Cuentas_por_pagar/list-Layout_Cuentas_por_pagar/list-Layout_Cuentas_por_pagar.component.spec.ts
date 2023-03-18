import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListLayout_Cuentas_por_pagarComponent } from './list-Layout_Cuentas_por_pagar.component';

describe('ListLayout_Cuentas_por_pagarComponent', () => {
  let component: ListLayout_Cuentas_por_pagarComponent;
  let fixture: ComponentFixture<ListLayout_Cuentas_por_pagarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListLayout_Cuentas_por_pagarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListLayout_Cuentas_por_pagarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
