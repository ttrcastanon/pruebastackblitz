import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListFuncionalidades_para_NotificacionComponent } from './list-Funcionalidades_para_Notificacion.component';

describe('ListFuncionalidades_para_NotificacionComponent', () => {
  let component: ListFuncionalidades_para_NotificacionComponent;
  let fixture: ComponentFixture<ListFuncionalidades_para_NotificacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListFuncionalidades_para_NotificacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListFuncionalidades_para_NotificacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
