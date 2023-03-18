import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListNotificaciones_PushComponent } from './list-Notificaciones_Push.component';

describe('ListNotificaciones_PushComponent', () => {
  let component: ListNotificaciones_PushComponent;
  let fixture: ComponentFixture<ListNotificaciones_PushComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListNotificaciones_PushComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListNotificaciones_PushComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
