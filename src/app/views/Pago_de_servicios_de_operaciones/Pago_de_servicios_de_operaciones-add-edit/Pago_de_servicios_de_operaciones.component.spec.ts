import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Pago_de_servicios_de_operacionesComponent } from './Pago_de_servicios_de_operaciones.component';

describe('Pago_de_servicios_de_operacionesComponent', () => {
  let component: Pago_de_servicios_de_operacionesComponent;
  let fixture: ComponentFixture<Pago_de_servicios_de_operacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Pago_de_servicios_de_operacionesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Pago_de_servicios_de_operacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

