import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterColoresComponent } from './show-advance-filter-Colores.component';

describe('ShowAdvanceFilterColoresComponent', () => {
  let component: ShowAdvanceFilterColoresComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterColoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterColoresComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterColoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
