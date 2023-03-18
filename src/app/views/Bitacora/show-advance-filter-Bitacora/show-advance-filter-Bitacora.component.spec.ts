import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterBitacoraComponent } from './show-advance-filter-Bitacora.component';

describe('ShowAdvanceFilterBitacoraComponent', () => {
  let component: ShowAdvanceFilterBitacoraComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterBitacoraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterBitacoraComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterBitacoraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
