import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterNotificaciones_de_mantenimientoComponent } from './show-advance-filter-Notificaciones_de_mantenimiento.component';

describe('ShowAdvanceFilterNotificaciones_de_mantenimientoComponent', () => {
  let component: ShowAdvanceFilterNotificaciones_de_mantenimientoComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterNotificaciones_de_mantenimientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterNotificaciones_de_mantenimientoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterNotificaciones_de_mantenimientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
