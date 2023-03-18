import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCat__reportes_prestablecidosComponent } from './list-Cat__reportes_prestablecidos.component';

describe('ListCat__reportes_prestablecidosComponent', () => {
  let component: ListCat__reportes_prestablecidosComponent;
  let fixture: ComponentFixture<ListCat__reportes_prestablecidosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListCat__reportes_prestablecidosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListCat__reportes_prestablecidosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
