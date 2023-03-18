import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTipo_de_urgenciaComponent } from './list-Tipo_de_urgencia.component';

describe('ListTipo_de_urgenciaComponent', () => {
  let component: ListTipo_de_urgenciaComponent;
  let fixture: ComponentFixture<ListTipo_de_urgenciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListTipo_de_urgenciaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListTipo_de_urgenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
