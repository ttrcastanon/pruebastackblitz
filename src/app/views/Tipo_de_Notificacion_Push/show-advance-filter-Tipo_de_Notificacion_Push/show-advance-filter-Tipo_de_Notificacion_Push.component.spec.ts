import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterTipo_de_Notificacion_PushComponent } from './show-advance-filter-Tipo_de_Notificacion_Push.component';

describe('ShowAdvanceFilterTipo_de_Notificacion_PushComponent', () => {
  let component: ShowAdvanceFilterTipo_de_Notificacion_PushComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterTipo_de_Notificacion_PushComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterTipo_de_Notificacion_PushComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterTipo_de_Notificacion_PushComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
