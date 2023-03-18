import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCargo_de_TripulanteComponent } from './list-Cargo_de_Tripulante.component';

describe('ListCargo_de_TripulanteComponent', () => {
  let component: ListCargo_de_TripulanteComponent;
  let fixture: ComponentFixture<ListCargo_de_TripulanteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListCargo_de_TripulanteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListCargo_de_TripulanteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
