import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterLayout_Presupuestos_VentasComponent } from './show-advance-filter-Layout_Presupuestos_Ventas.component';

describe('ShowAdvanceFilterLayout_Presupuestos_VentasComponent', () => {
  let component: ShowAdvanceFilterLayout_Presupuestos_VentasComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterLayout_Presupuestos_VentasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterLayout_Presupuestos_VentasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterLayout_Presupuestos_VentasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
