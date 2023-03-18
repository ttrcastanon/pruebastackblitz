import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterTipo_de_InstalacionComponent } from './show-advance-filter-Tipo_de_Instalacion.component';

describe('ShowAdvanceFilterTipo_de_InstalacionComponent', () => {
  let component: ShowAdvanceFilterTipo_de_InstalacionComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterTipo_de_InstalacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterTipo_de_InstalacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterTipo_de_InstalacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
