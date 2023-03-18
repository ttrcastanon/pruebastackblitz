import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTipo_de_ReporteComponent } from './list-Tipo_de_Reporte.component';

describe('ListTipo_de_ReporteComponent', () => {
  let component: ListTipo_de_ReporteComponent;
  let fixture: ComponentFixture<ListTipo_de_ReporteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListTipo_de_ReporteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListTipo_de_ReporteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
