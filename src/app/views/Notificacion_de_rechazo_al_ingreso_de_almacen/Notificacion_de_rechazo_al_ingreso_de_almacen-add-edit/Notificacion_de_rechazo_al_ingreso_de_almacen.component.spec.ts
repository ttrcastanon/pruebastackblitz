import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Notificacion_de_rechazo_al_ingreso_de_almacenComponent } from './Notificacion_de_rechazo_al_ingreso_de_almacen.component';

describe('Notificacion_de_rechazo_al_ingreso_de_almacenComponent', () => {
  let component: Notificacion_de_rechazo_al_ingreso_de_almacenComponent;
  let fixture: ComponentFixture<Notificacion_de_rechazo_al_ingreso_de_almacenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Notificacion_de_rechazo_al_ingreso_de_almacenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Notificacion_de_rechazo_al_ingreso_de_almacenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

