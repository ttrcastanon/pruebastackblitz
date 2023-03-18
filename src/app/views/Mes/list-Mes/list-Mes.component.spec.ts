import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListMesComponent } from './list-Mes.component';

describe('ListMesComponent', () => {
  let component: ListMesComponent;
  let fixture: ComponentFixture<ListMesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListMesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListMesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
