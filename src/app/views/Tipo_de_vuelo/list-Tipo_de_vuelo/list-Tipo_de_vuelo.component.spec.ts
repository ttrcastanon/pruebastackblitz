import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTipo_de_vueloComponent } from './list-Tipo_de_vuelo.component';

describe('ListTipo_de_vueloComponent', () => {
  let component: ListTipo_de_vueloComponent;
  let fixture: ComponentFixture<ListTipo_de_vueloComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListTipo_de_vueloComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListTipo_de_vueloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
