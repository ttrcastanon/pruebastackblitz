import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterCargosComponent } from './show-advance-filter-Cargos.component';

describe('ShowAdvanceFilterCargosComponent', () => {
  let component: ShowAdvanceFilterCargosComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterCargosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterCargosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterCargosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
