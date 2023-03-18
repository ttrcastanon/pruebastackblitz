import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterTipo_Frecuencia_NotificacionComponent } from './show-advance-filter-Tipo_Frecuencia_Notificacion.component';

describe('ShowAdvanceFilterTipo_Frecuencia_NotificacionComponent', () => {
  let component: ShowAdvanceFilterTipo_Frecuencia_NotificacionComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterTipo_Frecuencia_NotificacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterTipo_Frecuencia_NotificacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterTipo_Frecuencia_NotificacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
