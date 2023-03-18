import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCategoria_de_PartesComponent } from './list-Categoria_de_Partes.component';

describe('ListCategoria_de_PartesComponent', () => {
  let component: ListCategoria_de_PartesComponent;
  let fixture: ComponentFixture<ListCategoria_de_PartesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListCategoria_de_PartesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListCategoria_de_PartesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
