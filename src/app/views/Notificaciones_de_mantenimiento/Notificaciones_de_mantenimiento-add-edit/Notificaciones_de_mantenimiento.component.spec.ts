import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Notificaciones_de_mantenimientoComponent } from './Notificaciones_de_mantenimiento.component';

describe('Notificaciones_de_mantenimientoComponent', () => {
  let component: Notificaciones_de_mantenimientoComponent;
  let fixture: ComponentFixture<Notificaciones_de_mantenimientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Notificaciones_de_mantenimientoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Notificaciones_de_mantenimientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

