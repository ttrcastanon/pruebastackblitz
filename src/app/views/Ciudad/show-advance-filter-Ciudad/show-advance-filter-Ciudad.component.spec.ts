import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterCiudadComponent } from './show-advance-filter-Ciudad.component';

describe('ShowAdvanceFilterCiudadComponent', () => {
  let component: ShowAdvanceFilterCiudadComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterCiudadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterCiudadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterCiudadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
