import * as THREE from 'three';
import { TerrainType, TerrainProperties } from './terrainTypes.js';

export class Terrain extends THREE.Group {
    constructor(size) {
        super();
        this.size = size;
        this.tiles = [];
        this.terrainData = new Array(size).fill().map(() => new Array(size).fill(TerrainType.GRASS));
        this.initialize();
        // Commenting out tree generation for now
        // this.addDecorations();
    }

    initialize() {
        // Create the base terrain mesh with height variation
        const geometry = new THREE.PlaneGeometry(this.size, this.size, 200, 200);
        const vertices = geometry.attributes.position.array;
        const colors = new Float32Array(vertices.length);

        // Generate height and color data
        for (let i = 0; i < vertices.length; i += 3) {
            const x = vertices[i];
            const z = vertices[i + 2];
            
            // Keep the buildable area flat
            const distanceFromCenter = Math.sqrt(x * x + z * z);
            let height;
            
            if (distanceFromCenter < this.size/2.5) {
                height = 0; // Completely flat center area for building
            } else if (distanceFromCenter < this.size/2) {
                // Gradual slope with some variation
                const t = (distanceFromCenter - this.size/2.5) / (this.size/2 - this.size/2.5);
                height = this.noise(x, z) * 1.5 * t;
            } else {
                height = this.noise(x, z) * 2;
            }
            
            vertices[i + 1] = height;

            // Simplified color scheme for now
            let color = new THREE.Color(0x4CAF50); // Consistent grass green color
            colors[i] = color.r;
            colors[i + 1] = color.g;
            colors[i + 2] = color.b;
        }

        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.computeVertexNormals();

        const material = new THREE.MeshStandardMaterial({
            vertexColors: true,
            roughness: 0.8,
            metalness: 0.1,
            side: THREE.DoubleSide
        });
        
        this.baseTerrain = new THREE.Mesh(geometry, material);
        this.baseTerrain.rotation.x = -Math.PI / 2;
        this.baseTerrain.receiveShadow = true;
        this.add(this.baseTerrain);
    }

    // Comment out the entire addDecorations method for now
    /*
    addDecorations() {
        // Remove any existing trees
        this.children.forEach(child => {
            if (child !== this.baseTerrain && child.type === 'Group') {
                this.remove(child);
            }
        });

        // Add trees and vegetation in the non-buildable areas
        const treeCount = 400;
        const treeGeometry = new THREE.ConeGeometry(0.3, 1, 8);
        const treeMaterial = new THREE.MeshStandardMaterial({ color: 0x2E7D32 });
        const trunkGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.5);
        const trunkMaterial = new THREE.MeshStandardMaterial({ color: 0x4E342E });

        for (let i = 0; i < treeCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const radius = (this.size/2) * (Math.random() * 0.3 + 0.7); // Place trees in outer area
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;

            // Get the height at this position
            const height = this.getHeightAt(x, z);

            // Create tree
            const tree = new THREE.Group();
            
            // Create trunk
            const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
            trunk.position.y = 0.25;
            trunk.castShadow = true;
            tree.add(trunk);

            // Create foliage (2 cones for fuller look)
            const foliage1 = new THREE.Mesh(treeGeometry, treeMaterial);
            foliage1.position.y = 0.8;
            foliage1.castShadow = true;
            tree.add(foliage1);

            const foliage2 = new THREE.Mesh(treeGeometry, treeMaterial);
            foliage2.position.y = 1.1;
            foliage2.scale.set(0.8, 0.8, 0.8);
            foliage2.castShadow = true;
            tree.add(foliage2);

            // Position the tree
            tree.position.set(x, height, z);
            tree.rotation.y = Math.random() * Math.PI * 2;
            
            this.add(tree);
        }
    }
    */

    getHeightAt(x, z) {
        const distanceFromCenter = Math.sqrt(x * x + z * z);
        
        if (distanceFromCenter < this.size/2.5) {
            return 0;
        } else if (distanceFromCenter < this.size/2) {
            const t = (distanceFromCenter - this.size/2.5) / (this.size/2 - this.size/2.5);
            return this.noise(x, z) * 1.5 * t;
        } else {
            return this.noise(x, z) * 2;
        }
    }

    noise(x, z) {
        const noiseScale = 0.03;
        const octaves = 3;
        const persistence = 0.4;
        
        let total = 0;
        let frequency = 1;
        let amplitude = 1;
        let maxValue = 0;

        for (let i = 0; i < octaves; i++) {
            total += amplitude * Math.sin(x * frequency * noiseScale + z * frequency * noiseScale);
            maxValue += amplitude;
            amplitude *= persistence;
            frequency *= 2;
        }

        return total / maxValue;
    }

    updateTerrain(x, y, type) {
        if (x < 0 || x >= this.size || y < 0 || y >= this.size) return;
        this.terrainData[x][y] = type;
    }

    isBuildable(x, y) {
        if (x < 0 || x >= this.size || y < 0 || y >= this.size) return false;
        
        // Convert grid coordinates to relative coordinates
        const relX = x - this.size/2;
        const relY = y - this.size/2;
        
        // Check if within buildable radius
        const distanceFromCenter = Math.sqrt(relX * relX + relY * relY);
        return distanceFromCenter < this.size/2.5;
    }
} 