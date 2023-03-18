import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterNotificaciones_PushComponent } from './show-advance-filter-Notificaciones_Push.component';

describe('ShowAdvanceFilterNotificaciones_PushComponent', () => {
  let component: ShowAdvanceFilterNotificaciones_PushComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterNotificaciones_PushComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterNotificaciones_PushComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterNotificaciones_PushComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
