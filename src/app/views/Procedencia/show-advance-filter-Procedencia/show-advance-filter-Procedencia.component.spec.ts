import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterProcedenciaComponent } from './show-advance-filter-Procedencia.component';

describe('ShowAdvanceFilterProcedenciaComponent', () => {
  let component: ShowAdvanceFilterProcedenciaComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterProcedenciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterProcedenciaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterProcedenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
