import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Notificaciones_PushComponent } from './Notificaciones_Push.component';

describe('Notificaciones_PushComponent', () => {
  let component: Notificaciones_PushComponent;
  let fixture: ComponentFixture<Notificaciones_PushComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Notificaciones_PushComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Notificaciones_PushComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

