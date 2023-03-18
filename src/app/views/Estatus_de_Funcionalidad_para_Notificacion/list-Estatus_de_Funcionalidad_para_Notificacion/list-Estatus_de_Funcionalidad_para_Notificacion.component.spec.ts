import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListEstatus_de_Funcionalidad_para_NotificacionComponent } from './list-Estatus_de_Funcionalidad_para_Notificacion.component';

describe('ListEstatus_de_Funcionalidad_para_NotificacionComponent', () => {
  let component: ListEstatus_de_Funcionalidad_para_NotificacionComponent;
  let fixture: ComponentFixture<ListEstatus_de_Funcionalidad_para_NotificacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListEstatus_de_Funcionalidad_para_NotificacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListEstatus_de_Funcionalidad_para_NotificacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
