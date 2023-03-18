import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListEstatus_NotificacionComponent } from './list-Estatus_Notificacion.component';

describe('ListEstatus_NotificacionComponent', () => {
  let component: ListEstatus_NotificacionComponent;
  let fixture: ComponentFixture<ListEstatus_NotificacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListEstatus_NotificacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListEstatus_NotificacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
