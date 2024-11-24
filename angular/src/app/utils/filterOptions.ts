export const competitionFilterTennis = [
  { key: '0', code: 'atp_challenger_series' },
  { key: '1', code: 'atp_tour_250' },
  { key: '2', code: 'atp_tour_500' },
  { key: '3', code: 'atp_tour_masters_1000' },
  { key: '4', code: 'atp_world_tour_finals' },
  { key: '5', code: 'davis_cup' },
  { key: '6', code: 'grand_slam' },
  { key: '7', code: 'itf_world_tennis_tour' },
  { key: '8', code: 'olimpic_games' },
  { key: '9', code: 'league_ranking' },
  { key: '10', code: 'other' },
  { key: '11', code: 'african_tournament' },
  { key: '12', code: 'asian_tournament' },
  { key: '13', code: 'european_tournament' },
  { key: '14', code: 'local_tournament' },
  { key: '15', code: 'world_tournament' },
  { key: '16', code: 'national_tournament' },
  { key: '17', code: 'pan_american_tournament' },
  { key: '18', code: 'provincial_tournament' },
  { key: '19', code: 'regional_tournament' },
  { key: '20', code: 'south_american_tournament' },
];

export const competitonGeneralFilter = [
  {
    key: '0',
    code: 'friendly',
  },
  {
    key: '1',
    code: 'cup',
  },
  {
    key: '2',
    code: 'league',
  },
];

export const competitionSwimmingFilter = [
  {
    id: '0',
    code: 'african_championship',
  },
  {
    id: '1',
    code: 'asian_championship',
  },
  {
    id: '2',
    code: 'european_championship',
  },
  {
    id: '3',
    code: 'local_championship',
  },
  {
    id: '4',
    code: 'world_championship',
  },
  {
    id: '5',
    code: 'national_championship',
  },
  {
    id: '6',
    code: 'pan_american_championship',
  },
  {
    id: '7',
    code: 'provincial_championship',
  },
  {
    id: '8',
    code: 'regional_championship',
  },
  {
    id: '9',
    code: 'south_american_championship',
  },
  {
    id: '10',
    code: 'olimpic_games',
  },
  {
    id: '11',
    code: 'league_ranking',
  },
  {
    id: '12',
    code: 'other',
  },
];

/**
 * psychology
 */

export const psychologyGeneralFilter = [
  {
    key: '0',
    code: 'LBL_EVALUATOR',
    children: [
      {
        key: '0-1',
        id: 1,
        code: 'psychiatrist',
      },
      {
        key: '0-2',
        id: 2,
        code: 'neurologist',
      },
      {
        key: '0-3',
        id: 3,
        code: 'other',
      },
    ],
  },
];

/**
 * nutrition
 */

export const nutritionGeneralFilter = [
  {
    key: '0',
    code: 'tab',
    children: [
      {
        key: '0-1',
        id: 1,
        code: 'active',
      },
      {
        key: '0-2',
        id: 2,
        code: 'inactive',
      },
    ],
  },
];

/**
 * physiotherapy
 */

export const physiotherapyGeneralFilter = [
  {
    key: '0',
    code: 'tab',
    children: [
      {
        key: '0-1',
        id: 1,
        code: 'active',
      },
      {
        key: '0-2',
        id: 2,
        code: 'inactive',
      },
      {
        key: '0-3',
        id: 2,
        code: 'finished',
      },
    ],
  },
];

/**
 * workout
 */

export const contentCodes: any = {
  technicians: 'technicians',
  tactical: 'tactical',
  physical_preparation: 'physical_preparation',
  psychosocial: 'psychosocial',
};

export const distributionCodes: any = {
  individual: 'individual',
  group: 'group',
  collective: 'collective',
};

export const workoutGeneralFilterList = [
  {
    key: '0',
    label: 'Favoritas ❤️',
    code: 'favorites',
    disabled: true,
  },
  {
    key: '1',
    label: 'Contenido de trabajo',
    code: 'contents',
    children: [
      {
        key: '1-1',
        label: 'Técnica',
        code: contentCodes.technicians,
      },
      {
        key: '1-2',
        label: 'Táctica',
        code: contentCodes.tactical,
      },
      {
        key: '1-3',
        label: 'Preparación física',
        code: contentCodes.physical_preparation,
      },
      {
        key: '1-4',
        label: 'Psico-sociales',
        code: contentCodes.psychosocial,
      },
    ],
  },
  {
    key: '2',
    label: 'Distribución',
    code: 'distribution',
    children: [
      {
        key: '2-1',
        label: 'Individual',
        code: distributionCodes.individual,
      },
      {
        key: '2-2',
        label: 'Grupal',
        code: distributionCodes.group,
      },
      {
        key: '2-3',
        label: 'Colectiva',
        code: distributionCodes.collective,
      },
    ],
  },
];

/**
 * trainig sessions
 */

export const traininSessionGeneralFilterList = [
  {
    key: '0',
    code: 'like',
    disabled: true,
    children: [],
  },
  {
    key: '1',
    code: 'training_period',
    children: [
      {
        key: '1-1',
        id: 1,
        code: 'preparatory',
      },
      {
        key: '1-2',
        id: 2,
        code: 'season',
      },
      {
        key: '1-3',
        id: 3,
        code: 'transition',
      },
    ],
  },
  {
    key: '2',
    code: 'type_session',
    children: [
      {
        key: '2-1',
        id: 1,
        code: 'principal',
      },
      {
        key: '2-2',
        id: 2,
        code: 'complementary',
      },
      {
        key: '2-3',
        id: 3,
        code: 'preventive',
      },
      {
        key: '2-4',
        id: 4,
        code: 'regenerative',
      },
      {
        key: '2-5',
        id: 5,
        code: 'lesions',
      },
    ],
  },
];

/**
 * physiotherapy
 */

export const injuryGeneralFilter = [
  {
    key: '0',
    code: 'preventive_program',
    children: [
      {
        key: '0-1',
        id: 1,
        code: 'active',
      },
      {
        key: '0-2',
        id: 2,
        code: 'not_started',
      },
      {
        key: '0-3',
        id: 2,
        code: 'finished',
      },
    ],
  },
];

/**
 * scouting
 */

export const scoutingGeneralFilter = [
  {
    key: '0',
    code: 'match_situation',
    children: [
      {
        key: '0-1',
        id: 'L',
        code: 'local',
      },
      {
        key: '0-2',
        id: 'V',
        code: 'visitor',
      },
    ],
  },
];

export const testDetailsGeneralList = [
  {
    key: '0',
    code: 'category',
    children: [
      {
        id: 1,
        key: '0-1',
        code: 'anthropometric',
      },
      {
        id: 2,
        key: '0-2',
        code: 'physical_condition',
      },
      {
        id: 3,
        key: '0-3',
        code: 'motor_skills',
      },
      {
        id: 4,
        key: '0-4',
        code: 'physical_exploration',
      },
      {
        id: 5,
        key: '0-5',
        code: 'psychological_test',
      },
    ],
  },
  {
    key: '1',
    code: 'subCategory',
    children: [
      {
        id: 1,
        key: '1-1',
        code: 'strength',
      },
      {
        id: 2,
        key: '1-2',
        code: 'flexibility',
      },
      {
        id: 3,
        key: '1-3',
        code: 'endurance',
      },
      {
        id: 4,
        key: '1-4',
        code: 'speed',
      },
      {
        id: 5,
        key: '1-5',
        code: 'agility',
      },
      {
        id: 6,
        key: '1-6',
        code: 'coordination',
      },
      {
        id: 7,
        key: '1-7',
        code: 'balance',
      },
      {
        id: 8,
        key: '1-8',
        code: 'jump',
      },
      {
        id: 9,
        key: '1-9',
        code: 'shoulder',
      },
      {
        id: 10,
        key: '1-10',
        code: 'elbow',
      },
      {
        id: 11,
        key: '1-11',
        code: 'column',
      },
      {
        id: 12,
        key: '1-12',
        code: 'hips',
      },
      {
        id: 13,
        key: '1-13',
        code: 'thigh',
      },
      {
        id: 14,
        key: '1-14',
        code: 'calf',
      },
      {
        id: 15,
        key: '1-15',
        code: 'knee',
      },
      {
        id: 16,
        key: '1-16',
        code: 'ankle',
      },
      {
        id: 17,
        key: '1-17',
        code: 'heart_rate',
      },
      {
        id: 18,
        key: '1-18',
        code: 'gps',
      },
    ],
  },
];

export const effortRecoveryFilterList = [
  {
    key: '0',
    code: 'strategy',
    children: [
      {
        key: '0-1',
        id: 1,
        code: 'use_strategy',
      },
      {
        key: '0-2',
        id: 2,
        code: 'no_strategy',
      },
    ],
  },
];
