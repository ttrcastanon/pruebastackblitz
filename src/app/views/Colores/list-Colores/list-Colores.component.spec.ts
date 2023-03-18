import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListColoresComponent } from './list-Colores.component';

describe('ListColoresComponent', () => {
  let component: ListColoresComponent;
  let fixture: ComponentFixture<ListColoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListColoresComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListColoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
