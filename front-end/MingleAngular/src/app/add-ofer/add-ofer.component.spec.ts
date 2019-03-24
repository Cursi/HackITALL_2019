import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOferComponent } from './add-ofer.component';

describe('AddOferComponent', () => {
  let component: AddOferComponent;
  let fixture: ComponentFixture<AddOferComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddOferComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddOferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
