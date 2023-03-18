import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAnoComponent } from './list-Ano.component';

describe('ListAnoComponent', () => {
  let component: ListAnoComponent;
  let fixture: ComponentFixture<ListAnoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListAnoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListAnoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
