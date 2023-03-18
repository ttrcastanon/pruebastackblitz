import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListUtilidadComponent } from './list-Utilidad.component';

describe('ListUtilidadComponent', () => {
  let component: ListUtilidadComponent;
  let fixture: ComponentFixture<ListUtilidadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListUtilidadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListUtilidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
