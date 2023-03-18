import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterCargo_de_TripulanteComponent } from './show-advance-filter-Cargo_de_Tripulante.component';

describe('ShowAdvanceFilterCargo_de_TripulanteComponent', () => {
  let component: ShowAdvanceFilterCargo_de_TripulanteComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterCargo_de_TripulanteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterCargo_de_TripulanteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterCargo_de_TripulanteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
