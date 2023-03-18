import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListListado_de_Ordenes_de_TrabajoComponent } from './list-Listado_de_Ordenes_de_Trabajo.component';

describe('ListListado_de_Ordenes_de_TrabajoComponent', () => {
  let component: ListListado_de_Ordenes_de_TrabajoComponent;
  let fixture: ComponentFixture<ListListado_de_Ordenes_de_TrabajoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListListado_de_Ordenes_de_TrabajoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListListado_de_Ordenes_de_TrabajoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
