import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterEstatus_de_Funcionalidad_para_NotificacionComponent } from './show-advance-filter-Estatus_de_Funcionalidad_para_Notificacion.component';

describe('ShowAdvanceFilterEstatus_de_Funcionalidad_para_NotificacionComponent', () => {
  let component: ShowAdvanceFilterEstatus_de_Funcionalidad_para_NotificacionComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterEstatus_de_Funcionalidad_para_NotificacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterEstatus_de_Funcionalidad_para_NotificacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterEstatus_de_Funcionalidad_para_NotificacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
