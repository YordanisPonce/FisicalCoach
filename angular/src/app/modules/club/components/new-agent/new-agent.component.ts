import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AppStateQuery } from '../../../../stateManagement/appState.query';
import { PlayersService } from '../../../../_services/players.service';

@Component( {
  selector: 'app-new-agent',
  templateUrl: './new-agent.component.html',
  styleUrls: [ './new-agent.component.scss' ]
} )
export class NewAgentComponent implements OnInit, OnDestroy {
  
  formNewAgentPlayer: UntypedFormGroup;
  submitted = false;
  agentPlayers: any[] = [];
  @Output() save: EventEmitter<any> = new EventEmitter<any>();
  @Input() data: any = {};
  @Output() nextstep: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  saveDataLocal: EventEmitter<any> = new EventEmitter<any>();
  subsPlayer: Subscription;
  
  constructor( private formBuilder: UntypedFormBuilder,
               private appStateQuery: AppStateQuery,
               private playerService: PlayersService ) {
  }
  
  get f() {
    return this.formNewAgentPlayer.controls;
  }
  
  ngOnInit(): void {
    if ( this.data && this.data.agent_name ) {
      this.agentPlayers = this.data.agent_name;
    }
    this.subsPlayer = this.appStateQuery.player$.subscribe( res => {
      setTimeout( () => {
        this.loadForm();
      }, 500 );
    } );
    this.loadForm();
  }
  
  ngOnDestroy() {
    if ( !this.data.id && !this.submitted && this.agentPlayers.length > 0 ) {
      const data = { agent_name: this.agentPlayers };
      this.saveDataLocal.emit( data );
    }
    this.subsPlayer.unsubscribe();
  }
  
  loadForm() {
    this.formNewAgentPlayer = this.formBuilder.group( {
      agent_name: [ null, Validators.required ],
    } );
  }
  
  onSubmit() {
    this.submitted = true;
    if ( this.formNewAgentPlayer.invalid ) {
      return;
    }
    const data = this.formNewAgentPlayer.value;
    this.agentPlayers.push( data.agent_name );
    this.submitted = false;
    this.formNewAgentPlayer.reset();
    
  }
  
  handleSave() {
    const input = this.formNewAgentPlayer.controls.agent_name.value;
    if ( input !== '' && input !== null && input !== undefined ) {
      this.agentPlayers.push( input );
    }
    const data = { agents: this.agentPlayers };
    if ( !this.data.id ) {
      this.save.emit( data );
      return;
    }
    const player = Object.assign( this.data, data );
    this.playerService.add( player, true );
  }
}
