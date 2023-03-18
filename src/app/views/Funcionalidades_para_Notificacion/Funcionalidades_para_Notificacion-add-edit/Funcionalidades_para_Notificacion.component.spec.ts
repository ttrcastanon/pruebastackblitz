import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Funcionalidades_para_NotificacionComponent } from './Funcionalidades_para_Notificacion.component';

describe('Funcionalidades_para_NotificacionComponent', () => {
  let component: Funcionalidades_para_NotificacionComponent;
  let fixture: ComponentFixture<Funcionalidades_para_NotificacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Funcionalidades_para_NotificacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Funcionalidades_para_NotificacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

