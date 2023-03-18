import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListFabricanteComponent } from './list-Fabricante.component';

describe('ListFabricanteComponent', () => {
  let component: ListFabricanteComponent;
  let fixture: ComponentFixture<ListFabricanteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListFabricanteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListFabricanteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
