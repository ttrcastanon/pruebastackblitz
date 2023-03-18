import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterTipo_de_ClienteComponent } from './show-advance-filter-Tipo_de_Cliente.component';

describe('ShowAdvanceFilterTipo_de_ClienteComponent', () => {
  let component: ShowAdvanceFilterTipo_de_ClienteComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterTipo_de_ClienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterTipo_de_ClienteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterTipo_de_ClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
