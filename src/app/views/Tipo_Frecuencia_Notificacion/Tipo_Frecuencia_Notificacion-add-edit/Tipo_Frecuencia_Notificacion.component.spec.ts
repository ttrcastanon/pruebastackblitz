import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Tipo_Frecuencia_NotificacionComponent } from './Tipo_Frecuencia_Notificacion.component';

describe('Tipo_Frecuencia_NotificacionComponent', () => {
  let component: Tipo_Frecuencia_NotificacionComponent;
  let fixture: ComponentFixture<Tipo_Frecuencia_NotificacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Tipo_Frecuencia_NotificacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Tipo_Frecuencia_NotificacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

