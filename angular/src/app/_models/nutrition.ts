export interface Nutrition {
    take_supplements: boolean;
    take_diets: boolean;
    activity_factor: number;
    total_energy_expenditure: number;
    other_supplement: string;
    player_id: number,
    other_diet: string;
    supplements: number[];
    diets: number[];
    athlete_activity: any;
    team_id: number;
}

export interface Supplement {
    id: number,
    code: string,
    name: string
}

export interface Diet {
    id: number,
    code: string,
    name: string
}

export interface Weight {
    player_id: number;
    weight: number;
    team_id: number;
}