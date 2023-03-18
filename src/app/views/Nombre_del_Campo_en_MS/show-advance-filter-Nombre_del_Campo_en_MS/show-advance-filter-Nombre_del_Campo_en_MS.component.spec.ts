import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterNombre_del_Campo_en_MSComponent } from './show-advance-filter-Nombre_del_Campo_en_MS.component';

describe('ShowAdvanceFilterNombre_del_Campo_en_MSComponent', () => {
  let component: ShowAdvanceFilterNombre_del_Campo_en_MSComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterNombre_del_Campo_en_MSComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterNombre_del_Campo_en_MSComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterNombre_del_Campo_en_MSComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
