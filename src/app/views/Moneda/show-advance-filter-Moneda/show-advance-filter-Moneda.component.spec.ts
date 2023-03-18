import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterMonedaComponent } from './show-advance-filter-Moneda.component';

describe('ShowAdvanceFilterMonedaComponent', () => {
  let component: ShowAdvanceFilterMonedaComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterMonedaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterMonedaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterMonedaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
