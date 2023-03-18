import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterEstatus_de_ClienteComponent } from './show-advance-filter-Estatus_de_Cliente.component';

describe('ShowAdvanceFilterEstatus_de_ClienteComponent', () => {
  let component: ShowAdvanceFilterEstatus_de_ClienteComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterEstatus_de_ClienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterEstatus_de_ClienteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterEstatus_de_ClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
