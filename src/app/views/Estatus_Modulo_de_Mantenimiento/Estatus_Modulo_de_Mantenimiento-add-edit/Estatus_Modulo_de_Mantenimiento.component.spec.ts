import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Estatus_Modulo_de_MantenimientoComponent } from './Estatus_Modulo_de_Mantenimiento.component';

describe('Estatus_Modulo_de_MantenimientoComponent', () => {
  let component: Estatus_Modulo_de_MantenimientoComponent;
  let fixture: ComponentFixture<Estatus_Modulo_de_MantenimientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Estatus_Modulo_de_MantenimientoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Estatus_Modulo_de_MantenimientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

