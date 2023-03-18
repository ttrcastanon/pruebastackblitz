import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterCategoria_de_PartesComponent } from './show-advance-filter-Categoria_de_Partes.component';

describe('ShowAdvanceFilterCategoria_de_PartesComponent', () => {
  let component: ShowAdvanceFilterCategoria_de_PartesComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterCategoria_de_PartesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterCategoria_de_PartesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterCategoria_de_PartesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
