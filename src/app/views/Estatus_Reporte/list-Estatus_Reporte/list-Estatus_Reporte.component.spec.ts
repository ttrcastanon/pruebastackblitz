import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListEstatus_ReporteComponent } from './list-Estatus_Reporte.component';

describe('ListEstatus_ReporteComponent', () => {
  let component: ListEstatus_ReporteComponent;
  let fixture: ComponentFixture<ListEstatus_ReporteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListEstatus_ReporteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListEstatus_ReporteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
