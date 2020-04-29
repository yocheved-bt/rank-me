import { Component, OnInit, Input, ViewRef } from '@angular/core';

@Component({
  selector: 'yb-widget',
  template: `
    <div class="card my-3">
          <div class="card-body">
              <h5 class="card-title">{{title}} {{count}}</h5>
              <button (click)="increase()" class="btn btn-sm btn-success mr-1">UP</button>
              <button (click)="decrement()" class="btn btn-sm btn-info mr-1">DOWN</button>
              <button (click)="switch(this)" class="btn btn-sm btn-outline-primary mr-1 ">Switch</button>
              <button (click)="edit(this)" class="btn btn-sm btn-outline-danger mr-1">Edit</button>
              <div>
              </div>
          </div>
      </div>
  `,
  styles: []
})
export class WidgetComponent implements OnInit {

  @Input() title: string;
  count: number;
  viewRef: ViewRef;
  switch: Function;
  edit: Function;

  constructor() { }

  ngOnInit(): void {
    this.count =0;
  }

  increase() {
    this.count++;
  }

  decrement() {
    this.count--;
  }

}
