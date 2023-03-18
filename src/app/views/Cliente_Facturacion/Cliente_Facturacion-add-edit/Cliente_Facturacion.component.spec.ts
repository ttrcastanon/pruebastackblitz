import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Cliente_FacturacionComponent } from './Cliente_Facturacion.component';

describe('Cliente_FacturacionComponent', () => {
  let component: Cliente_FacturacionComponent;
  let fixture: ComponentFixture<Cliente_FacturacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Cliente_FacturacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Cliente_FacturacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

