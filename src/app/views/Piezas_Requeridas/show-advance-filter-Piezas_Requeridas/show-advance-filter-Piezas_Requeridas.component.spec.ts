import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterPiezas_RequeridasComponent } from './show-advance-filter-Piezas_Requeridas.component';

describe('ShowAdvanceFilterPiezas_RequeridasComponent', () => {
  let component: ShowAdvanceFilterPiezas_RequeridasComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterPiezas_RequeridasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterPiezas_RequeridasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterPiezas_RequeridasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
