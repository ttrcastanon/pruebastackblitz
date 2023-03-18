import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Estatus_de_Funcionalidad_para_NotificacionComponent } from './Estatus_de_Funcionalidad_para_Notificacion.component';

describe('Estatus_de_Funcionalidad_para_NotificacionComponent', () => {
  let component: Estatus_de_Funcionalidad_para_NotificacionComponent;
  let fixture: ComponentFixture<Estatus_de_Funcionalidad_para_NotificacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Estatus_de_Funcionalidad_para_NotificacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Estatus_de_Funcionalidad_para_NotificacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

