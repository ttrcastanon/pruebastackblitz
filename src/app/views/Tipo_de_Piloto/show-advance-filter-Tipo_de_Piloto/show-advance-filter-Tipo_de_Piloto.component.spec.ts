import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterTipo_de_PilotoComponent } from './show-advance-filter-Tipo_de_Piloto.component';

describe('ShowAdvanceFilterTipo_de_PilotoComponent', () => {
  let component: ShowAdvanceFilterTipo_de_PilotoComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterTipo_de_PilotoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterTipo_de_PilotoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterTipo_de_PilotoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
