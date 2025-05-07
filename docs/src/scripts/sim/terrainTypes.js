export const TerrainType = {
    GRASS: 'grass',
    SAND: 'sand',
    FOREST: 'forest'
};

export const TerrainProperties = {
    [TerrainType.GRASS]: {
        color: 0x4CAF50,
        roughness: 0.8,
        metalness: 0.2,
        opacity: 1.0,
        buildable: true
    },
    [TerrainType.SAND]: {
        color: 0xF4A460,
        roughness: 0.9,
        metalness: 0.1,
        opacity: 0.3,
        buildable: true
    },
    [TerrainType.FOREST]: {
        color: 0x2E7D32,
        roughness: 0.7,
        metalness: 0.1,
        opacity: 0.4,
        buildable: false
    }
}; 