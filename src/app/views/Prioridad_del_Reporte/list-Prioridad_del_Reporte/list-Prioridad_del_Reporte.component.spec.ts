import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPrioridad_del_ReporteComponent } from './list-Prioridad_del_Reporte.component';

describe('ListPrioridad_del_ReporteComponent', () => {
  let component: ListPrioridad_del_ReporteComponent;
  let fixture: ComponentFixture<ListPrioridad_del_ReporteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListPrioridad_del_ReporteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListPrioridad_del_ReporteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
