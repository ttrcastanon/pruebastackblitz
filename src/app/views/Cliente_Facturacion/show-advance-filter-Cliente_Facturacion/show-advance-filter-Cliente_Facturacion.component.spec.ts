import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterCliente_FacturacionComponent } from './show-advance-filter-Cliente_Facturacion.component';

describe('ShowAdvanceFilterCliente_FacturacionComponent', () => {
  let component: ShowAdvanceFilterCliente_FacturacionComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterCliente_FacturacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterCliente_FacturacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterCliente_FacturacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
