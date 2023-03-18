import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterPago_de_servicios_de_operacionesComponent } from './show-advance-filter-Pago_de_servicios_de_operaciones.component';

describe('ShowAdvanceFilterPago_de_servicios_de_operacionesComponent', () => {
  let component: ShowAdvanceFilterPago_de_servicios_de_operacionesComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterPago_de_servicios_de_operacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterPago_de_servicios_de_operacionesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterPago_de_servicios_de_operacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
