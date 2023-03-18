import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Tipo_de_NotificacionComponent } from './Tipo_de_Notificacion.component';

describe('Tipo_de_NotificacionComponent', () => {
  let component: Tipo_de_NotificacionComponent;
  let fixture: ComponentFixture<Tipo_de_NotificacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Tipo_de_NotificacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Tipo_de_NotificacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

