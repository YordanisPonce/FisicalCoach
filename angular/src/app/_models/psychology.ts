
import { Player } from './player'

export interface PlayerPsychology extends Player {
    psychology_reports: PsychologyReport[];
}

export interface PsychologyReport {
    anamnesis: string;
    cause: string;
    date: string;
    id: number;
    note: string;
    player_id: number;
    staff_id: number;
    player_image: string;
    player_name: string;
    player_team: string;
    presumptive_diagnosis: string;
    psychology_specialist_id: number;
    psychology_specialist_name: string;
    staff_name: string;
    team_staff_id: number;
    team_staff_name: string;
}