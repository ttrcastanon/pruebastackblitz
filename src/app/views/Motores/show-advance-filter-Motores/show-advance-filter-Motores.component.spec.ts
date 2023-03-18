import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterMotoresComponent } from './show-advance-filter-Motores.component';

describe('ShowAdvanceFilterMotoresComponent', () => {
  let component: ShowAdvanceFilterMotoresComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterMotoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterMotoresComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterMotoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
