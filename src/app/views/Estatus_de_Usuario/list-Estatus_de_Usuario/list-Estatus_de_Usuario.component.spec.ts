import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListEstatus_de_UsuarioComponent } from './list-Estatus_de_Usuario.component';

describe('ListEstatus_de_UsuarioComponent', () => {
  let component: ListEstatus_de_UsuarioComponent;
  let fixture: ComponentFixture<ListEstatus_de_UsuarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListEstatus_de_UsuarioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListEstatus_de_UsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
