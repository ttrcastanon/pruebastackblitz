import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Condicion_del_itemComponent } from './Condicion_del_item.component';

describe('Condicion_del_itemComponent', () => {
  let component: Condicion_del_itemComponent;
  let fixture: ComponentFixture<Condicion_del_itemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Condicion_del_itemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Condicion_del_itemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

