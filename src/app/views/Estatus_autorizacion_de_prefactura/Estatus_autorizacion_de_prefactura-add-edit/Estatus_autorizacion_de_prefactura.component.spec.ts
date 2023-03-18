import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Estatus_autorizacion_de_prefacturaComponent } from './Estatus_autorizacion_de_prefactura.component';

describe('Estatus_autorizacion_de_prefacturaComponent', () => {
  let component: Estatus_autorizacion_de_prefacturaComponent;
  let fixture: ComponentFixture<Estatus_autorizacion_de_prefacturaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Estatus_autorizacion_de_prefacturaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Estatus_autorizacion_de_prefacturaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

