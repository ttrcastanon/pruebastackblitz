import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListConfiguracion_de_NotificacionComponent } from './list-Configuracion_de_Notificacion.component';

describe('ListConfiguracion_de_NotificacionComponent', () => {
  let component: ListConfiguracion_de_NotificacionComponent;
  let fixture: ComponentFixture<ListConfiguracion_de_NotificacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListConfiguracion_de_NotificacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListConfiguracion_de_NotificacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
