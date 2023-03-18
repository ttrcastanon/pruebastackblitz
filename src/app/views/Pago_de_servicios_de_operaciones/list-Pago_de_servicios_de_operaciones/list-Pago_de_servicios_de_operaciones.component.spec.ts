import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPago_de_servicios_de_operacionesComponent } from './list-Pago_de_servicios_de_operaciones.component';

describe('ListPago_de_servicios_de_operacionesComponent', () => {
  let component: ListPago_de_servicios_de_operacionesComponent;
  let fixture: ComponentFixture<ListPago_de_servicios_de_operacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListPago_de_servicios_de_operacionesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListPago_de_servicios_de_operacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
