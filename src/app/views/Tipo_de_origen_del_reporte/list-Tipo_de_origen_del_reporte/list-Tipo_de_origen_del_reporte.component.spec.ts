import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTipo_de_origen_del_reporteComponent } from './list-Tipo_de_origen_del_reporte.component';

describe('ListTipo_de_origen_del_reporteComponent', () => {
  let component: ListTipo_de_origen_del_reporteComponent;
  let fixture: ComponentFixture<ListTipo_de_origen_del_reporteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListTipo_de_origen_del_reporteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListTipo_de_origen_del_reporteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
