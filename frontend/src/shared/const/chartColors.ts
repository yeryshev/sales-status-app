import {
  blue,
  purple,
  green,
  red,
  cyan,
  deepPurple,
  lightGreen,
  pink,
  indigo,
  teal,
  amber,
  lime,
  lightBlue,
  brown,
  grey,
  blueGrey,
  orange,
  yellow,
} from '@mui/material/colors';

// Цветовая схема MUI для графиков с приятными и разнообразными оттенками
export const chartColors = {
  // Основные цвета MUI
  primary: blue[600],
  secondary: purple[400],
  success: green[500],
  warning: amber[600],
  error: red[400],
  info: lightBlue[500],

  // Цвета для каналов (максимально разнообразные оттенки)
  channelColors: {
    call: red[500], // Яркий красный
    email: blue[600], // Яркий синий
    event: lime[600], // Яркий лаймовый
    tickets: teal[500], // Яркий бирюзовый
    campaign: purple[500], // Яркий фиолетовый
    chatwoot: amber[600], // Яркий золотистый
    telegram: indigo[500], // Яркий индиго
    coldCall: pink[500], // Яркий розовый
    personalContact: green[500], // Яркий зеленый
    unspecified: grey[600], // Темно-серый для "Канал не указан"
  },

  // Цвета для типов сделок
  typeColors: {
    upsale: orange[500], // Яркий оранжевый
    newsale: cyan[500], // Яркий голубой
    accounttransfer: deepPurple[500], // Яркий темно-фиолетовый
  },

  // Цвета для причин неуспешных сделок
  failureColors: {
    noanswer: red[400], // Яркий красный
    bedservice: lightBlue[500], // Яркий светло-синий
    legalproblem: yellow[600], // Яркий желтый
    nomoreneeded: brown[500], // Яркий коричневый
    nooportunity: blueGrey[500], // Яркий серо-синий
  },

  // Цвета для менеджеров (максимально разнообразные оттенки)
  managerColors: [
    blue[600], // Яркий синий
    purple[500], // Яркий фиолетовый
    lime[600], // Яркий лаймовый
    green[500], // Яркий зеленый
    red[500], // Яркий красный
    cyan[500], // Яркий голубой
    amber[600], // Яркий золотистый
    deepPurple[500], // Яркий темно-фиолетовый
    lightGreen[600], // Яркий светло-зеленый
    pink[500], // Яркий розовый
    indigo[500], // Яркий индиго
    teal[500], // Яркий бирюзовый
    orange[500], // Яркий оранжевый
    yellow[600], // Яркий желтый
    lightBlue[600], // Яркий светло-синий
    brown[500], // Яркий коричневый
    grey[500], // Яркий серый
    blueGrey[500], // Яркий серо-синий
  ],

  // Цвета для конверсии
  conversionColors: {
    received: blue[600], // Яркий синий
    qualified: amber[600], // Яркий золотистый
    successful: green[600], // Яркий зеленый
  },
};
