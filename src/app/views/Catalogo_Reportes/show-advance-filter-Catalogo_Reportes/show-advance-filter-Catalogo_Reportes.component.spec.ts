import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterCatalogo_ReportesComponent } from './show-advance-filter-Catalogo_Reportes.component';

describe('ShowAdvanceFilterCatalogo_ReportesComponent', () => {
  let component: ShowAdvanceFilterCatalogo_ReportesComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterCatalogo_ReportesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterCatalogo_ReportesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterCatalogo_ReportesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
