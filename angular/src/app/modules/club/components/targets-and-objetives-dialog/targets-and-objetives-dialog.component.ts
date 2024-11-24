import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

interface Content {
  code: string;
  id: number;
  image: {
    full_url: string;
  };
  name: string;
  sub_contents: {
    name: string;
    targets: any[];
  }[];
  targets: any[];
}

interface ContentBlock {
  code: string;
  id: number;
  name: string;
}
@Component({
  selector: 'app-targets-and-objetives-dialog',
  templateUrl: './targets-and-objetives-dialog.component.html',
  styleUrls: ['./targets-and-objetives-dialog.component.scss'],
})
export class TargetsAndObjetivesDialogComponent implements OnInit {
  @Input() visible: boolean = false;
  @Input() workoutContentList: Content[] = [];
  @Input() contentBlockList: ContentBlock[] = [];
  @Output() close: EventEmitter<any> = new EventEmitter<any>();

  searchContent: string = '';

  constructor() {}

  ngOnInit(): void {
    console.log(this.contentBlockList);
  }

  getScreenWidth(): any {
    return screen.width;
  }

  getIndexes(list: any[]): number[] {
    return list.map((item, i) => i);
  }

  dialogTitle(type: string): string {
    return type === 'content' ? 'targetsAndContents' : 'content_blocks'
  }

  /**
   * Filter content
   * @param e Event
   */
  setValue() {}
}
