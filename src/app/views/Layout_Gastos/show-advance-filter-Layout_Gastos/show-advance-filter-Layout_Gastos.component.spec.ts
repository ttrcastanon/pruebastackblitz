import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterLayout_GastosComponent } from './show-advance-filter-Layout_Gastos.component';

describe('ShowAdvanceFilterLayout_GastosComponent', () => {
  let component: ShowAdvanceFilterLayout_GastosComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterLayout_GastosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterLayout_GastosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterLayout_GastosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
