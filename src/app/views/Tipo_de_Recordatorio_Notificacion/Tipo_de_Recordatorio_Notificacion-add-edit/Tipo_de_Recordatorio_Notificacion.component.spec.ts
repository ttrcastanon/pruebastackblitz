import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Tipo_de_Recordatorio_NotificacionComponent } from './Tipo_de_Recordatorio_Notificacion.component';

describe('Tipo_de_Recordatorio_NotificacionComponent', () => {
  let component: Tipo_de_Recordatorio_NotificacionComponent;
  let fixture: ComponentFixture<Tipo_de_Recordatorio_NotificacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Tipo_de_Recordatorio_NotificacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Tipo_de_Recordatorio_NotificacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

