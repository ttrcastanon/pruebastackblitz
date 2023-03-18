import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPiezasComponent } from './list-Piezas.component';

describe('ListPiezasComponent', () => {
  let component: ListPiezasComponent;
  let fixture: ComponentFixture<ListPiezasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListPiezasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListPiezasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
