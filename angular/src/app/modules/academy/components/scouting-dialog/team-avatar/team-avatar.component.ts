import { Component, Input, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-team-avatar',
  templateUrl: './team-avatar.component.html',
  styleUrls: ['./team-avatar.component.scss'],
})
export class TeamAvatarComponent implements OnInit {
  @Input() matchInfo: any;
  @Input() situation: string;
  urlBaseImagenes = environment.images;

  constructor() {}

  ngOnInit(): void {}
}
