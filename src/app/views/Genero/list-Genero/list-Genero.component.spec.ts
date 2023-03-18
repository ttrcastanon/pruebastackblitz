import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListGeneroComponent } from './list-Genero.component';

describe('ListGeneroComponent', () => {
  let component: ListGeneroComponent;
  let fixture: ComponentFixture<ListGeneroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListGeneroComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListGeneroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
