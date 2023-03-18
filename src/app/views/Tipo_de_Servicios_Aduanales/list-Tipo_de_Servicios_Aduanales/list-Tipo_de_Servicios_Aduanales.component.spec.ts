import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTipo_de_Servicios_AduanalesComponent } from './list-Tipo_de_Servicios_Aduanales.component';

describe('ListTipo_de_Servicios_AduanalesComponent', () => {
  let component: ListTipo_de_Servicios_AduanalesComponent;
  let fixture: ComponentFixture<ListTipo_de_Servicios_AduanalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListTipo_de_Servicios_AduanalesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListTipo_de_Servicios_AduanalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
