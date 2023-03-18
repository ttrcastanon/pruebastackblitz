import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterClienteComponent } from './show-advance-filter-Cliente.component';

describe('ShowAdvanceFilterClienteComponent', () => {
  let component: ShowAdvanceFilterClienteComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterClienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterClienteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
