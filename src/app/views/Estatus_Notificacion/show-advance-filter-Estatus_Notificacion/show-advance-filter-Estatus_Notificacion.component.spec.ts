import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterEstatus_NotificacionComponent } from './show-advance-filter-Estatus_Notificacion.component';

describe('ShowAdvanceFilterEstatus_NotificacionComponent', () => {
  let component: ShowAdvanceFilterEstatus_NotificacionComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterEstatus_NotificacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterEstatus_NotificacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterEstatus_NotificacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
