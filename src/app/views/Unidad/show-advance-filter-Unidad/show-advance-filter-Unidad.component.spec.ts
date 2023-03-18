import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterUnidadComponent } from './show-advance-filter-Unidad.component';

describe('ShowAdvanceFilterUnidadComponent', () => {
  let component: ShowAdvanceFilterUnidadComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterUnidadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterUnidadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterUnidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
