import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPaisComponent } from './list-Pais.component';

describe('ListPaisComponent', () => {
  let component: ListPaisComponent;
  let fixture: ComponentFixture<ListPaisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListPaisComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListPaisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
