import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPartesComponent } from './list-Partes.component';

describe('ListPartesComponent', () => {
  let component: ListPartesComponent;
  let fixture: ComponentFixture<ListPartesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListPartesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListPartesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
