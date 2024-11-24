export type RatingIcon = {
  icon: string;
  value: number;
  text: string;
  color: string;
  tooltip?: string;
};

export const ratingIcons: RatingIcon[] = [
  {
    icon: '5_green_face.svg',
    value: 1,
    text: 'very_good',
    color: '#00E9C5',
    tooltip: 'minimun_cal',
  },

  {
    icon: '4_Blue_face.svg',
    value: 2,
    text: 'good',
    color: '#035AC8',
    tooltip: 'light_cal',
  },

  {
    icon: '3_yellow_face.svg',
    value: 3,
    text: 'regular',
    color: '#869E1D',
    tooltip: 'moderate_cal',
  },
  {
    icon: '2_orange_face.svg',
    value: 4,
    text: 'bad',
    color: '#9C6F17',
    tooltip: 'high_cal',
  },
  {
    icon: '1_red_face.svg',
    value: 5,
    text: 'very_bad',
    color: '#F92F28',
    tooltip: 'maximun_cal',
  },
];
