import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterUrgenciaComponent } from './show-advance-filter-Urgencia.component';

describe('ShowAdvanceFilterUrgenciaComponent', () => {
  let component: ShowAdvanceFilterUrgenciaComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterUrgenciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterUrgenciaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterUrgenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
