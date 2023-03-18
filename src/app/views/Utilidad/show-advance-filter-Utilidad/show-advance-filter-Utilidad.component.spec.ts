import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterUtilidadComponent } from './show-advance-filter-Utilidad.component';

describe('ShowAdvanceFilterUtilidadComponent', () => {
  let component: ShowAdvanceFilterUtilidadComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterUtilidadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterUtilidadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterUtilidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
