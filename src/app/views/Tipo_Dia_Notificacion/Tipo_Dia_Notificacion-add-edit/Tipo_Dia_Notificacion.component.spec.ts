import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Tipo_Dia_NotificacionComponent } from './Tipo_Dia_Notificacion.component';

describe('Tipo_Dia_NotificacionComponent', () => {
  let component: Tipo_Dia_NotificacionComponent;
  let fixture: ComponentFixture<Tipo_Dia_NotificacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Tipo_Dia_NotificacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Tipo_Dia_NotificacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

