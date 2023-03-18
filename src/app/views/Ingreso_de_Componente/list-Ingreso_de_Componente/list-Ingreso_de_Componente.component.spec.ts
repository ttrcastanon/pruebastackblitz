import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListIngreso_de_ComponenteComponent } from './list-Ingreso_de_Componente.component';

describe('ListIngreso_de_ComponenteComponent', () => {
  let component: ListIngreso_de_ComponenteComponent;
  let fixture: ComponentFixture<ListIngreso_de_ComponenteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListIngreso_de_ComponenteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListIngreso_de_ComponenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
