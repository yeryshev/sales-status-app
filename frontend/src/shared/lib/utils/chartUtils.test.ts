import { calculateYAxisMax, calculateStackedYAxisMax } from './chartUtils';

describe('chartUtils', () => {
  describe('calculateYAxisMax', () => {
    it('должен округлять 1976.4 до 2380 (1976.4 * 1.2 = 2371.68 → 2380)', () => {
      const values = [1976.4];
      const result = calculateYAxisMax(values);
      expect(result).toBe(2380);
    });

    it('должен округлять 717.6 до 870 (717.6 * 1.2 = 861.12 → 870)', () => {
      const values = [717.6];
      const result = calculateYAxisMax(values);
      expect(result).toBe(870);
    });

    it('должен округлять 1000 до 1200 (с множителем 1.2)', () => {
      const values = [1000];
      const result = calculateYAxisMax(values);
      expect(result).toBe(1200);
    });

    it('должен округлять 1234.5 до 1490 (1234.5 * 1.2 = 1481.4 → 1490)', () => {
      const values = [1234.5];
      const result = calculateYAxisMax(values);
      expect(result).toBe(1490);
    });

    it('должен возвращать 100 для пустого массива', () => {
      const values: number[] = [];
      const result = calculateYAxisMax(values);
      expect(result).toBe(100);
    });

    it('должен работать с массивом значений', () => {
      const values = [100, 200, 300, 400];
      const result = calculateYAxisMax(values);
      expect(result).toBe(480); // 400 * 1.2 = 480, округляем до 480
    });

    it('должен работать с кастомным множителем', () => {
      const values = [1000];
      const result = calculateYAxisMax(values, 1.5);
      expect(result).toBe(1500); // 1000 * 1.5 = 1500
    });

    it('должен правильно округлять примеры из требований', () => {
      // Пример 1: 1976.4 * 1.2 = 2371.68 → округляем до 2380
      expect(calculateYAxisMax([1976.4])).toBe(2380);

      // Пример 2: 717.6 * 1.2 = 861.12 → округляем до 870
      expect(calculateYAxisMax([717.6])).toBe(870);
    });
  });

  describe('calculateStackedYAxisMax', () => {
    it('должен правильно вычислять максимальное значение для стекированных данных', () => {
      const data = [
        {
          datasets: [{ data: 100 }, { data: 200 }, { data: 300 }],
        },
        {
          datasets: [{ data: 150 }, { data: 250 }, { data: 350 }],
        },
      ];

      const result = calculateStackedYAxisMax(data);
      // Максимальная сумма: 150 + 250 + 350 = 750
      // 750 * 1.2 = 900, округляем до 900
      expect(result).toBe(900);
    });

    it('должен возвращать 100 для пустого массива', () => {
      const data: Array<{ datasets: Array<{ data: number }> }> = [];
      const result = calculateStackedYAxisMax(data);
      expect(result).toBe(100);
    });

    it('должен работать с кастомным множителем', () => {
      const data = [
        {
          datasets: [{ data: 100 }, { data: 200 }],
        },
      ];

      const result = calculateStackedYAxisMax(data, 1.5);
      // Максимальная сумма: 100 + 200 = 300
      // 300 * 1.5 = 450, округляем до 450
      expect(result).toBe(450);
    });
  });
});
