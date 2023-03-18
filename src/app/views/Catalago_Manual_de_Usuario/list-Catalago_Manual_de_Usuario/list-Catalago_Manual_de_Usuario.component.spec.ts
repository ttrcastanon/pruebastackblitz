import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCatalago_Manual_de_UsuarioComponent } from './list-Catalago_Manual_de_Usuario.component';

describe('ListCatalago_Manual_de_UsuarioComponent', () => {
  let component: ListCatalago_Manual_de_UsuarioComponent;
  let fixture: ComponentFixture<ListCatalago_Manual_de_UsuarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListCatalago_Manual_de_UsuarioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListCatalago_Manual_de_UsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
