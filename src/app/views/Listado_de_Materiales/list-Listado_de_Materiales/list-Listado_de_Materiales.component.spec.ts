import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListListado_de_MaterialesComponent } from './list-Listado_de_Materiales.component';

describe('ListListado_de_MaterialesComponent', () => {
  let component: ListListado_de_MaterialesComponent;
  let fixture: ComponentFixture<ListListado_de_MaterialesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListListado_de_MaterialesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListListado_de_MaterialesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
