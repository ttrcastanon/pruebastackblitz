import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Estatus_NotificacionComponent } from './Estatus_Notificacion.component';

describe('Estatus_NotificacionComponent', () => {
  let component: Estatus_NotificacionComponent;
  let fixture: ComponentFixture<Estatus_NotificacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Estatus_NotificacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Estatus_NotificacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

