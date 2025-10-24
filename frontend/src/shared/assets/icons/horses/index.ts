// Динамический импорт всех PNG иконок лошадей
import first from './first.png';
import last from './last.png';
import regular1 from './regular1.png';
import regular2 from './regular2.png';
import regular3 from './regular3.png';
import regular4 from './regular4.png';
import regular5 from './regular5.png';

// Прямые импорты специальных иконок (только существующие файлы)
import icon437 from './437.png';
import icon633 from './633.png';
import icon892 from './892.png';
import icon992 from './992.png';
import icon1045 from './1045.png';
import icon1361 from './1361.png';
import icon1399 from './1399.png';
import icon1666 from './1666.png';

// Базовые иконки (всегда доступны)
export const baseHorseIcons = {
  first: first,
  last: last,
  regular1: regular1,
  regular2: regular2,
  regular3: regular3,
  regular4: regular4,
  regular5: regular5,
};

// Специальные иконки по ID (только существующие файлы)
export const specialHorseIcons = {
  437: icon437,
  633: icon633,
  892: icon892,
  992: icon992,
  1045: icon1045,
  1361: icon1361,
  1399: icon1399,
  1666: icon1666,
};

// Объединенный объект всех иконок
export const horseIcons = {
  ...baseHorseIcons,
  ...specialHorseIcons,
};

export default horseIcons;
