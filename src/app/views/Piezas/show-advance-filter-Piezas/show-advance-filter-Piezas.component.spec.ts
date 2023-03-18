import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterPiezasComponent } from './show-advance-filter-Piezas.component';

describe('ShowAdvanceFilterPiezasComponent', () => {
  let component: ShowAdvanceFilterPiezasComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterPiezasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterPiezasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterPiezasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
