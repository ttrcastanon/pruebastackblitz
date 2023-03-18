import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterSexoComponent } from './show-advance-filter-Sexo.component';

describe('ShowAdvanceFilterSexoComponent', () => {
  let component: ShowAdvanceFilterSexoComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterSexoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterSexoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterSexoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
