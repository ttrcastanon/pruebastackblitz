import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAgrupacion_de_ReportesComponent } from './list-Agrupacion_de_Reportes.component';

describe('ListAgrupacion_de_ReportesComponent', () => {
  let component: ListAgrupacion_de_ReportesComponent;
  let fixture: ComponentFixture<ListAgrupacion_de_ReportesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListAgrupacion_de_ReportesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListAgrupacion_de_ReportesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
