import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterPasajerosComponent } from './show-advance-filter-Pasajeros.component';

describe('ShowAdvanceFilterPasajerosComponent', () => {
  let component: ShowAdvanceFilterPasajerosComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterPasajerosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterPasajerosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterPasajerosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
