import { ViewChild,
  ViewContainerRef,
  ElementRef,
  ComponentFactory,
  ComponentFactoryResolver,
  Injector,
  Renderer2,
  ChangeDetectorRef,
  OnInit,
  Component} from '@angular/core';
import { WidgetComponent } from './widget.component';

@Component({
  selector: 'yb-layout',
  template: `
    <div class="row">
          <div class="col left-area">
              <h4>Rate Area</h4>
              <ng-container #leftSide></ng-container>
          </div>
          <div class="col">
              <h4>Create & Edit Area</h4>
              <div class="form-group">
                  <input class="form-control"
                         #inputRef
                         placeholder="Widget Title"
                         [(ngModel)]="widgetTitle"
                         (keydown.enter)="stopEdit()"
                         name="title">
              </div>
              <button (click)="createWidget()" class="btn btn-primary mr-1">Create</button>
              <button (click)="removeAll()" class="btn btn-danger">remove all</button>
              <ng-container #rightSide></ng-container>
          </div>
      </div>
  `,
  styles: [".edit {border-color: red}"]
})
export class LayoutComponent implements OnInit {
  @ViewChild("rightSide", { read: ViewContainerRef })
  rightSide: ViewContainerRef;
  @ViewChild("leftSide", { read: ViewContainerRef }) leftSide: ViewContainerRef;
  @ViewChild("inputRef") inputRef: ElementRef;

  private widgetFactory: ComponentFactory<WidgetComponent>;
  private _title: string;
  selectedWidget: WidgetComponent;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private injector: Injector,
    private renderer: Renderer2,
    private changeDetectionRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.widgetFactory = this.componentFactoryResolver.resolveComponentFactory(WidgetComponent);
    this.resetLayoutState();
  }

  set widgetTitle(newTitle: string) {
    this._title = newTitle;

    if (this.selectedWidget) {
      this.selectedWidget.title = this._title;
    }
  }

  get widgetTitle() {
    return this._title;
  }

  createWidget(){

    const widgetComponent = this.widgetFactory.create(this.injector);
    const widgetViewRef = this.rightSide.insert(widgetComponent.hostView);

     // pass the widget data
     widgetComponent.instance.title = this.widgetTitle;
     widgetComponent.instance.viewRef = widgetViewRef; // set the current component state

     widgetComponent.instance.switch = this.switch.bind(this);
     widgetComponent.instance.edit = this.edit.bind(this);

     this.resetLayoutState();

  }

   // detach from one view container and attach to another
   switch(widget: WidgetComponent) {
    const widgetViewRef = widget.viewRef;

    if (this.rightSide.indexOf(widgetViewRef) >= 0) {
      widget.viewRef = this.leftSide.insert(this.rightSide.detach(this.rightSide.indexOf(widgetViewRef)));
      this.resetLayoutState();
    }

    if (this.leftSide.indexOf(widgetViewRef) >= 0) {
      widget.viewRef = this.rightSide.insert(this.leftSide.detach(this.leftSide.indexOf(widgetViewRef)));
      this.selectedWidget = widget;
      this.widgetTitle = widget.title;
    }
  }

  edit(widget: WidgetComponent) {
    // prevent editing when on the left side
    if (this.leftSide.indexOf(widget.viewRef) < 0) {
      this.selectedWidget = widget;
      this.widgetTitle = this.selectedWidget.title;
      this.renderer.addClass(this.inputRef.nativeElement, 'edit',);
    }
  }

  stopEdit() {
    this.resetLayoutState();
    this.renderer.removeClass(this.inputRef.nativeElement, 'edit');
  }

  removeAll() {
    this.rightSide.clear();
    this.leftSide.clear();
  }

  private resetLayoutState() {
    this.selectedWidget = null;
    this.widgetTitle = '';
  }

}
