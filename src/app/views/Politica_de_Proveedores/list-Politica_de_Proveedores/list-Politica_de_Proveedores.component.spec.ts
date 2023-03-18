import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPolitica_de_ProveedoresComponent } from './list-Politica_de_Proveedores.component';

describe('ListPolitica_de_ProveedoresComponent', () => {
  let component: ListPolitica_de_ProveedoresComponent;
  let fixture: ComponentFixture<ListPolitica_de_ProveedoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListPolitica_de_ProveedoresComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListPolitica_de_ProveedoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
