import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterPropietariosComponent } from './show-advance-filter-Propietarios.component';

describe('ShowAdvanceFilterPropietariosComponent', () => {
  let component: ShowAdvanceFilterPropietariosComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterPropietariosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterPropietariosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterPropietariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
