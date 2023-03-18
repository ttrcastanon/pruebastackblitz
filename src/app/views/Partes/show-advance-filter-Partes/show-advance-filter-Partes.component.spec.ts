import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterPartesComponent } from './show-advance-filter-Partes.component';

describe('ShowAdvanceFilterPartesComponent', () => {
  let component: ShowAdvanceFilterPartesComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterPartesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterPartesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterPartesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
