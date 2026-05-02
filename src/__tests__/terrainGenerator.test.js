import { TerrainGenerator } from '../js/terrainGenerator';
import { RNG } from '../js/rng';

describe('TerrainGenerator', () => {
  test('should create an instance', () => {
    const params = {
      terrain: {
        scale: 0.01,
        offset: 0.5,
        magnitude: 0.5
      }
    };
    const size = { width: 32, height: 16 };
    const generator = new TerrainGenerator(params, size);
    expect(generator).toBeInstanceOf(TerrainGenerator);
    expect(generator.params).toBe(params);
    expect(generator.size).toBe(size);
  });

  test('should generate terrain data', () => {
    const params = {
      terrain: {
        scale: 0.01,
        offset: 0.5,
        magnitude: 0.5
      }
    };
    const size = { width: 2, height: 2 };
    const generator = new TerrainGenerator(params, size);
    const rng = new RNG(12345);
    const data = [
      [[{ id: 0 }], [{ id: 0 }]],
      [[{ id: 0 }], [{ id: 0 }]]
    ];

    generator.generate(rng, data, 0, 0);

    // Check that some blocks have been set
    expect(data.some(row => row.some(col => col.some(block => block.id !== 0)))).toBe(true);
  });
});