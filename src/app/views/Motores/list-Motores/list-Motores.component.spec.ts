import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListMotoresComponent } from './list-Motores.component';

describe('ListMotoresComponent', () => {
  let component: ListMotoresComponent;
  let fixture: ComponentFixture<ListMotoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListMotoresComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListMotoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
