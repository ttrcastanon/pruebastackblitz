import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterCatalago_Manual_de_UsuarioComponent } from './show-advance-filter-Catalago_Manual_de_Usuario.component';

describe('ShowAdvanceFilterCatalago_Manual_de_UsuarioComponent', () => {
  let component: ShowAdvanceFilterCatalago_Manual_de_UsuarioComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterCatalago_Manual_de_UsuarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterCatalago_Manual_de_UsuarioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterCatalago_Manual_de_UsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
