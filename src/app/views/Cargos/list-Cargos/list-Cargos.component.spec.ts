import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCargosComponent } from './list-Cargos.component';

describe('ListCargosComponent', () => {
  let component: ListCargosComponent;
  let fixture: ComponentFixture<ListCargosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListCargosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListCargosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
