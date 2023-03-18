import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCliente_FacturacionComponent } from './list-Cliente_Facturacion.component';

describe('ListCliente_FacturacionComponent', () => {
  let component: ListCliente_FacturacionComponent;
  let fixture: ComponentFixture<ListCliente_FacturacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListCliente_FacturacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListCliente_FacturacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
