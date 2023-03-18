import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAutorizacionComponent } from './list-Autorizacion.component';

describe('ListAutorizacionComponent', () => {
  let component: ListAutorizacionComponent;
  let fixture: ComponentFixture<ListAutorizacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListAutorizacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListAutorizacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
