import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListEstatus_de_ReporteComponent } from './list-Estatus_de_Reporte.component';

describe('ListEstatus_de_ReporteComponent', () => {
  let component: ListEstatus_de_ReporteComponent;
  let fixture: ComponentFixture<ListEstatus_de_ReporteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListEstatus_de_ReporteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListEstatus_de_ReporteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
