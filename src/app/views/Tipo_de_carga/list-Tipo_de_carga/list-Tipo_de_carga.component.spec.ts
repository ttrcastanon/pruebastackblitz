import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTipo_de_cargaComponent } from './list-Tipo_de_carga.component';

describe('ListTipo_de_cargaComponent', () => {
  let component: ListTipo_de_cargaComponent;
  let fixture: ComponentFixture<ListTipo_de_cargaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListTipo_de_cargaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListTipo_de_cargaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
