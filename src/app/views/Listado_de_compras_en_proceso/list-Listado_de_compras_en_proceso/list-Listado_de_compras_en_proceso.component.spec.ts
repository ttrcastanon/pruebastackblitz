import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListListado_de_compras_en_procesoComponent } from './list-Listado_de_compras_en_proceso.component';

describe('ListListado_de_compras_en_procesoComponent', () => {
  let component: ListListado_de_compras_en_procesoComponent;
  let fixture: ComponentFixture<ListListado_de_compras_en_procesoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListListado_de_compras_en_procesoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListListado_de_compras_en_procesoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
