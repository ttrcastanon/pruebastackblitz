import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterTipo_de_vueloComponent } from './show-advance-filter-Tipo_de_vuelo.component';

describe('ShowAdvanceFilterTipo_de_vueloComponent', () => {
  let component: ShowAdvanceFilterTipo_de_vueloComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterTipo_de_vueloComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterTipo_de_vueloComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterTipo_de_vueloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
