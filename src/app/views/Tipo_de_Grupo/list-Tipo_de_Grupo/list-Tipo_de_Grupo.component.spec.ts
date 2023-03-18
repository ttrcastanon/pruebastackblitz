import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTipo_de_GrupoComponent } from './list-Tipo_de_Grupo.component';

describe('ListTipo_de_GrupoComponent', () => {
  let component: ListTipo_de_GrupoComponent;
  let fixture: ComponentFixture<ListTipo_de_GrupoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListTipo_de_GrupoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListTipo_de_GrupoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
