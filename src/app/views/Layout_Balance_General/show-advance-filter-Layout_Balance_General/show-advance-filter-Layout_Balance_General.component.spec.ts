import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterLayout_Balance_GeneralComponent } from './show-advance-filter-Layout_Balance_General.component';

describe('ShowAdvanceFilterLayout_Balance_GeneralComponent', () => {
  let component: ShowAdvanceFilterLayout_Balance_GeneralComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterLayout_Balance_GeneralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterLayout_Balance_GeneralComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterLayout_Balance_GeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
