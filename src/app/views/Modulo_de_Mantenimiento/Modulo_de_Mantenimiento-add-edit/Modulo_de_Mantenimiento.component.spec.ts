import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Modulo_de_MantenimientoComponent } from './Modulo_de_Mantenimiento.component';

describe('Modulo_de_MantenimientoComponent', () => {
  let component: Modulo_de_MantenimientoComponent;
  let fixture: ComponentFixture<Modulo_de_MantenimientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Modulo_de_MantenimientoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Modulo_de_MantenimientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

