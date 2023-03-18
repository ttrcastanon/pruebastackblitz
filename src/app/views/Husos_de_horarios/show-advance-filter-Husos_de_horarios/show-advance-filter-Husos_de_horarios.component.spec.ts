import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterHusos_de_horariosComponent } from './show-advance-filter-Husos_de_horarios.component';

describe('ShowAdvanceFilterHusos_de_horariosComponent', () => {
  let component: ShowAdvanceFilterHusos_de_horariosComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterHusos_de_horariosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterHusos_de_horariosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterHusos_de_horariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
