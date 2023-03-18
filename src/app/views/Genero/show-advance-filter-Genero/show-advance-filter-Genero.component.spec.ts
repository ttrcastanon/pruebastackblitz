import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterGeneroComponent } from './show-advance-filter-Genero.component';

describe('ShowAdvanceFilterGeneroComponent', () => {
  let component: ShowAdvanceFilterGeneroComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterGeneroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterGeneroComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterGeneroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
