import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterDepartamentoComponent } from './show-advance-filter-Departamento.component';

describe('ShowAdvanceFilterDepartamentoComponent', () => {
  let component: ShowAdvanceFilterDepartamentoComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterDepartamentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterDepartamentoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterDepartamentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
