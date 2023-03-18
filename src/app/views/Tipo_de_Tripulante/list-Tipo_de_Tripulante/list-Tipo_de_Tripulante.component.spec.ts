import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTipo_de_TripulanteComponent } from './list-Tipo_de_Tripulante.component';

describe('ListTipo_de_TripulanteComponent', () => {
  let component: ListTipo_de_TripulanteComponent;
  let fixture: ComponentFixture<ListTipo_de_TripulanteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListTipo_de_TripulanteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListTipo_de_TripulanteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
