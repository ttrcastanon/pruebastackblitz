import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Boletines_Directivas_aeronavegatibilidadComponent } from './Boletines_Directivas_aeronavegatibilidad.component';

describe('Boletines_Directivas_aeronavegatibilidadComponent', () => {
  let component: Boletines_Directivas_aeronavegatibilidadComponent;
  let fixture: ComponentFixture<Boletines_Directivas_aeronavegatibilidadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Boletines_Directivas_aeronavegatibilidadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Boletines_Directivas_aeronavegatibilidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

