import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterCat__reportes_prestablecidosComponent } from './show-advance-filter-Cat__reportes_prestablecidos.component';

describe('ShowAdvanceFilterCat__reportes_prestablecidosComponent', () => {
  let component: ShowAdvanceFilterCat__reportes_prestablecidosComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterCat__reportes_prestablecidosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterCat__reportes_prestablecidosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterCat__reportes_prestablecidosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
