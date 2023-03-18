import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterTipo_de_AvisoComponent } from './show-advance-filter-Tipo_de_Aviso.component';

describe('ShowAdvanceFilterTipo_de_AvisoComponent', () => {
  let component: ShowAdvanceFilterTipo_de_AvisoComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterTipo_de_AvisoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterTipo_de_AvisoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterTipo_de_AvisoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
