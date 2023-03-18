import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListFormato_de_salida_de_aeronaveComponent } from './list-Formato_de_salida_de_aeronave.component';

describe('ListFormato_de_salida_de_aeronaveComponent', () => {
  let component: ListFormato_de_salida_de_aeronaveComponent;
  let fixture: ComponentFixture<ListFormato_de_salida_de_aeronaveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListFormato_de_salida_de_aeronaveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListFormato_de_salida_de_aeronaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
