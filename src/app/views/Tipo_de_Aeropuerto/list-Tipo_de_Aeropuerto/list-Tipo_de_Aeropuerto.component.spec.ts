import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTipo_de_AeropuertoComponent } from './list-Tipo_de_Aeropuerto.component';

describe('ListTipo_de_AeropuertoComponent', () => {
  let component: ListTipo_de_AeropuertoComponent;
  let fixture: ComponentFixture<ListTipo_de_AeropuertoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListTipo_de_AeropuertoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListTipo_de_AeropuertoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
