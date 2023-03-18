import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterEstatus_de_UsuarioComponent } from './show-advance-filter-Estatus_de_Usuario.component';

describe('ShowAdvanceFilterEstatus_de_UsuarioComponent', () => {
  let component: ShowAdvanceFilterEstatus_de_UsuarioComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterEstatus_de_UsuarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterEstatus_de_UsuarioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterEstatus_de_UsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
