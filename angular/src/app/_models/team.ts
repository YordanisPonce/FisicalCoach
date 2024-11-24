export interface Team {
    name?: string;
    competition_id: number;
    id?: number;
    image_id: number;
    rival_team: string;
    url_image: string;
    image_url?: string;
}
export interface TypeLineUps {
    id: number;
    sport_id: number;
    modality_id: number;
    lineup: string;
    total_players: number;
}

export interface Staff {
    full_name: string;
    id: number;
    image: any;
    position_staff: any;
}