import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListNotificaciones_de_mantenimientoComponent } from './list-Notificaciones_de_mantenimiento.component';

describe('ListNotificaciones_de_mantenimientoComponent', () => {
  let component: ListNotificaciones_de_mantenimientoComponent;
  let fixture: ComponentFixture<ListNotificaciones_de_mantenimientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListNotificaciones_de_mantenimientoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListNotificaciones_de_mantenimientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
