import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Tipo_de_Notificacion_PushComponent } from './Tipo_de_Notificacion_Push.component';

describe('Tipo_de_Notificacion_PushComponent', () => {
  let component: Tipo_de_Notificacion_PushComponent;
  let fixture: ComponentFixture<Tipo_de_Notificacion_PushComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Tipo_de_Notificacion_PushComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Tipo_de_Notificacion_PushComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

