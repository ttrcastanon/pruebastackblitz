import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterPaisComponent } from './show-advance-filter-Pais.component';

describe('ShowAdvanceFilterPaisComponent', () => {
  let component: ShowAdvanceFilterPaisComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterPaisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterPaisComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterPaisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
