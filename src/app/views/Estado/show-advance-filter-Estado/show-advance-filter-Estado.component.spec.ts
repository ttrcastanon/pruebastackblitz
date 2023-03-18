import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterEstadoComponent } from './show-advance-filter-Estado.component';

describe('ShowAdvanceFilterEstadoComponent', () => {
  let component: ShowAdvanceFilterEstadoComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterEstadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterEstadoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterEstadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
