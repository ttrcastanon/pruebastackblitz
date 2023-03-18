import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTipo_Dia_NotificacionComponent } from './list-Tipo_Dia_Notificacion.component';

describe('ListTipo_Dia_NotificacionComponent', () => {
  let component: ListTipo_Dia_NotificacionComponent;
  let fixture: ComponentFixture<ListTipo_Dia_NotificacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListTipo_Dia_NotificacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListTipo_Dia_NotificacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
