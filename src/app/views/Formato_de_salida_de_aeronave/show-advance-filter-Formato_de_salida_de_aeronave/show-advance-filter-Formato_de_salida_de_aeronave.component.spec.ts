import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterFormato_de_salida_de_aeronaveComponent } from './show-advance-filter-Formato_de_salida_de_aeronave.component';

describe('ShowAdvanceFilterFormato_de_salida_de_aeronaveComponent', () => {
  let component: ShowAdvanceFilterFormato_de_salida_de_aeronaveComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterFormato_de_salida_de_aeronaveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterFormato_de_salida_de_aeronaveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterFormato_de_salida_de_aeronaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
