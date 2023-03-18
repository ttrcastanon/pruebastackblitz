import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListBoletines_Directivas_aeronavegatibilidadComponent } from './list-Boletines_Directivas_aeronavegatibilidad.component';

describe('ListBoletines_Directivas_aeronavegatibilidadComponent', () => {
  let component: ListBoletines_Directivas_aeronavegatibilidadComponent;
  let fixture: ComponentFixture<ListBoletines_Directivas_aeronavegatibilidadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListBoletines_Directivas_aeronavegatibilidadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListBoletines_Directivas_aeronavegatibilidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
