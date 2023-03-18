import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTipo_de_Notificacion_PushComponent } from './list-Tipo_de_Notificacion_Push.component';

describe('ListTipo_de_Notificacion_PushComponent', () => {
  let component: ListTipo_de_Notificacion_PushComponent;
  let fixture: ComponentFixture<ListTipo_de_Notificacion_PushComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListTipo_de_Notificacion_PushComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListTipo_de_Notificacion_PushComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
