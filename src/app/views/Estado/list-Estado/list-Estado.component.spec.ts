import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListEstadoComponent } from './list-Estado.component';

describe('ListEstadoComponent', () => {
  let component: ListEstadoComponent;
  let fixture: ComponentFixture<ListEstadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListEstadoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListEstadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
