import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterIngreso_de_ComponenteComponent } from './show-advance-filter-Ingreso_de_Componente.component';

describe('ShowAdvanceFilterIngreso_de_ComponenteComponent', () => {
  let component: ShowAdvanceFilterIngreso_de_ComponenteComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterIngreso_de_ComponenteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterIngreso_de_ComponenteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterIngreso_de_ComponenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
