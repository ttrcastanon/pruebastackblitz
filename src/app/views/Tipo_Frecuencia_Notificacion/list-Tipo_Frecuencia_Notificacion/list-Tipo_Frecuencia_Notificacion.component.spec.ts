import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTipo_Frecuencia_NotificacionComponent } from './list-Tipo_Frecuencia_Notificacion.component';

describe('ListTipo_Frecuencia_NotificacionComponent', () => {
  let component: ListTipo_Frecuencia_NotificacionComponent;
  let fixture: ComponentFixture<ListTipo_Frecuencia_NotificacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListTipo_Frecuencia_NotificacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListTipo_Frecuencia_NotificacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
