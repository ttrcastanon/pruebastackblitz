import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterPistasComponent } from './show-advance-filter-Pistas.component';

describe('ShowAdvanceFilterPistasComponent', () => {
  let component: ShowAdvanceFilterPistasComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterPistasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterPistasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterPistasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
