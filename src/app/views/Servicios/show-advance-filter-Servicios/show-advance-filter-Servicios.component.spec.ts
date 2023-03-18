import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterServiciosComponent } from './show-advance-filter-Servicios.component';

describe('ShowAdvanceFilterServiciosComponent', () => {
  let component: ShowAdvanceFilterServiciosComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterServiciosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterServiciosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterServiciosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
