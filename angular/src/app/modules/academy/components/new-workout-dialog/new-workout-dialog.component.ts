import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
} from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Ejercicio } from 'src/app/_models/ejercicio';
import Echo from 'laravel-echo';

@Component({
  selector: 'app-new-workout-dialog',
  templateUrl: './new-workout-dialog.component.html',
  styleUrls: ['./new-workout-dialog.component.scss'],
})
export class NewWorkoutDialogComponent implements OnInit, OnDestroy {
  @Input() urlTeam: string = '';
  @Input() visible: boolean = false;
  @Input() exerciseCreated: Ejercicio;
  @Output() dismiss: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() close: EventEmitter<boolean> = new EventEmitter<boolean>();

  locale: string = localStorage.getItem('languaje') as string;
  urlBase = environment.resourcesIframe;
  pusherCluster = environment.PUSHER_CLUSTER;
  pusherKey = environment.PUSHER_KEY;
  wsHOST = environment.WS_HOST;
  url: string = '';
  urlSafe: SafeResourceUrl;
  echo: any;
  body = document.body;
  img: File;
  previewImage: string;

  constructor(private sanitizer: DomSanitizer) {}

  websocket() {}

  closeDialog() {
    this.dismiss.emit(false);
  }

  ngOnInit(): void {
    const havePreviousExercise = `&previous_code=${this.exerciseCreated.previous_code}&_locale=${this.locale}`;
    const isNewExercise = `&_locale=${this.locale}`;

    const url = `${this.urlBase + this.urlTeam}?exercise_code=${
      this.exerciseCreated.exercise_code
    }${
      this.exerciseCreated.previous_code ? havePreviousExercise : isNewExercise
    }&mode=${this.exerciseCreated.mode}`;

    this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(url);

    this.echo = new Echo({
      broadcaster: 'reverb',
      key: this.pusherKey,
      wsHost: this.wsHOST,
      wsPort: 80,
      wssPort: 443,
      forceTLS: false,
      enableLoggin: true,
      enableTransports: ['ws', 'wss'],
    });

    this.echo
      .channel(`exercise.3d.${this.exerciseCreated.exercise_code}`)
      .listen('.exercise-3d', (resp: any) => {
        if (
          resp?.status === 'finished' &&
          this.exerciseCreated.mode === 'edit'
        ) {
          this.close.emit(false);
        }

        if (
          resp?.status === 'finished' &&
          this.exerciseCreated.mode === 'new'
        ) {
          this.dismiss.emit(false);
        }

        if (resp?.status === 'closed' && this.exerciseCreated.mode === 'show') {
          this.close.emit(false);
        }
      });
  }

  ngOnDestroy(): void {
    if (this.echo) {
      this.echo.leave(`exercise.3d.${this.exerciseCreated.exercise_code}`);
      this.echo.disconnect();
    }
  }
}
