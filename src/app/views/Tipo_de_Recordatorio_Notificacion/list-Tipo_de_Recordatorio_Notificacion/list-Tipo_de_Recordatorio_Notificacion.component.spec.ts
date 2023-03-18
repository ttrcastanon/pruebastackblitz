import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTipo_de_Recordatorio_NotificacionComponent } from './list-Tipo_de_Recordatorio_Notificacion.component';

describe('ListTipo_de_Recordatorio_NotificacionComponent', () => {
  let component: ListTipo_de_Recordatorio_NotificacionComponent;
  let fixture: ComponentFixture<ListTipo_de_Recordatorio_NotificacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListTipo_de_Recordatorio_NotificacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListTipo_de_Recordatorio_NotificacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
