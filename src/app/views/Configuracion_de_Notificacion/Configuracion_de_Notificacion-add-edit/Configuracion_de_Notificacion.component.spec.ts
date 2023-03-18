import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Configuracion_de_NotificacionComponent } from './Configuracion_de_Notificacion.component';

describe('Configuracion_de_NotificacionComponent', () => {
  let component: Configuracion_de_NotificacionComponent;
  let fixture: ComponentFixture<Configuracion_de_NotificacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Configuracion_de_NotificacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Configuracion_de_NotificacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

