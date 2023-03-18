import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterTipo_de_MiscelaneasComponent } from './show-advance-filter-Tipo_de_Miscelaneas.component';

describe('ShowAdvanceFilterTipo_de_MiscelaneasComponent', () => {
  let component: ShowAdvanceFilterTipo_de_MiscelaneasComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterTipo_de_MiscelaneasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterTipo_de_MiscelaneasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterTipo_de_MiscelaneasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
