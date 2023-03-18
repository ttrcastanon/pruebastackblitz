import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListEstatus_TripulacionComponent } from './list-Estatus_Tripulacion.component';

describe('ListEstatus_TripulacionComponent', () => {
  let component: ListEstatus_TripulacionComponent;
  let fixture: ComponentFixture<ListEstatus_TripulacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListEstatus_TripulacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListEstatus_TripulacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
