import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListNotificacion_de_rechazo_al_ingreso_de_almacenComponent } from './list-Notificacion_de_rechazo_al_ingreso_de_almacen.component';

describe('ListNotificacion_de_rechazo_al_ingreso_de_almacenComponent', () => {
  let component: ListNotificacion_de_rechazo_al_ingreso_de_almacenComponent;
  let fixture: ComponentFixture<ListNotificacion_de_rechazo_al_ingreso_de_almacenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListNotificacion_de_rechazo_al_ingreso_de_almacenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListNotificacion_de_rechazo_al_ingreso_de_almacenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
