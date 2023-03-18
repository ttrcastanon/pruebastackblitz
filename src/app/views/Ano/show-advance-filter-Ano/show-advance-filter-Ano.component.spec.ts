import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterAnoComponent } from './show-advance-filter-Ano.component';

describe('ShowAdvanceFilterAnoComponent', () => {
  let component: ShowAdvanceFilterAnoComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterAnoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterAnoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterAnoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
