import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterTipo_Dia_NotificacionComponent } from './show-advance-filter-Tipo_Dia_Notificacion.component';

describe('ShowAdvanceFilterTipo_Dia_NotificacionComponent', () => {
  let component: ShowAdvanceFilterTipo_Dia_NotificacionComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterTipo_Dia_NotificacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterTipo_Dia_NotificacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterTipo_Dia_NotificacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
