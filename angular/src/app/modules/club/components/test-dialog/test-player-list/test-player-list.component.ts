
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Player } from 'src/app/_models/player';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-test-player-list',
  templateUrl: './test-player-list.component.html',
  styleUrls: ['./test-player-list.component.scss']
})
export class TestPlayerListComponent implements OnInit {
  value: any;

  @Input() visible: boolean = false;
  @Input() players: Player[] = [];
  @Input() selectedPlayers: Player[] = [];
  @Output() close = new EventEmitter<boolean>();
  @Output() sendSelectedPlayers = new EventEmitter<Player[]>();

  urlBase = environment.images
  playerList: Player[] = [];
  searchPlayer: string;

  closeDialog() {
    // this.advancedDialog = false
    this.close.emit(false)
  }

  ngOnInit(): void {

    const selected = this.players.filter(item => this.selectedPlayers.includes(item));

    if (selected.length > 0)
    {
      this.value = selected;
    }

    this.playerList = this.players;
  }

  /**
  * Filter Player
  * @param e Event
  */
  setValue(e: KeyboardEvent) {
    const filterPlayers = this.players?.filter(item => item.full_name?.toLowerCase().includes(this.searchPlayer));

    if (this.searchPlayer.length > 0)
    {
      this.players = filterPlayers;
    } else
    {
      this.players = this.playerList;
    }
  }

  /**
   * send players
   */
  sendPlayers(): void {

    if (this.value.length > 0) this.sendSelectedPlayers.emit(this.value);

    this.closeDialog();
  }

}
