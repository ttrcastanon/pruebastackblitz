import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterTipo_de_Accion_NotificacionComponent } from './show-advance-filter-Tipo_de_Accion_Notificacion.component';

describe('ShowAdvanceFilterTipo_de_Accion_NotificacionComponent', () => {
  let component: ShowAdvanceFilterTipo_de_Accion_NotificacionComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterTipo_de_Accion_NotificacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterTipo_de_Accion_NotificacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterTipo_de_Accion_NotificacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
