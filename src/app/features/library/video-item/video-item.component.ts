import { Component, Input, OnInit } from '@angular/core';

import { ShownVideo } from '../../../shared/interfaces/shown-video.interface';

@Component({
  selector: 'app-video-item',
  templateUrl: './video-item.component.html',
  styleUrls: ['./video-item.component.scss']
})
export class VideoItemComponent implements OnInit {

  @Input() video: ShownVideo;

  constructor() { }

  ngOnInit() {
  }

}
