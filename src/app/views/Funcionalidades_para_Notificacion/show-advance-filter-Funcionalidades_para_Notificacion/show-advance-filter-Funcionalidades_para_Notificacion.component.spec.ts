import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterFuncionalidades_para_NotificacionComponent } from './show-advance-filter-Funcionalidades_para_Notificacion.component';

describe('ShowAdvanceFilterFuncionalidades_para_NotificacionComponent', () => {
  let component: ShowAdvanceFilterFuncionalidades_para_NotificacionComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterFuncionalidades_para_NotificacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterFuncionalidades_para_NotificacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterFuncionalidades_para_NotificacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
