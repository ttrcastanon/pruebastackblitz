import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterReabrir_vueloComponent } from './show-advance-filter-Reabrir_vuelo.component';

describe('ShowAdvanceFilterReabrir_vueloComponent', () => {
  let component: ShowAdvanceFilterReabrir_vueloComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterReabrir_vueloComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterReabrir_vueloComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterReabrir_vueloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
