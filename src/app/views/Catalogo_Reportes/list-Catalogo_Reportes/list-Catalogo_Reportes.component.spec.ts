import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCatalogo_ReportesComponent } from './list-Catalogo_Reportes.component';

describe('ListCatalogo_ReportesComponent', () => {
  let component: ListCatalogo_ReportesComponent;
  let fixture: ComponentFixture<ListCatalogo_ReportesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListCatalogo_ReportesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListCatalogo_ReportesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
