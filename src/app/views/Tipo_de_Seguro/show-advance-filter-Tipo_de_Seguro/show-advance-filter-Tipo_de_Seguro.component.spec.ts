import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterTipo_de_SeguroComponent } from './show-advance-filter-Tipo_de_Seguro.component';

describe('ShowAdvanceFilterTipo_de_SeguroComponent', () => {
  let component: ShowAdvanceFilterTipo_de_SeguroComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterTipo_de_SeguroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterTipo_de_SeguroComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterTipo_de_SeguroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
