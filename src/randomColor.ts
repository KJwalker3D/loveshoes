import { Color3, Color4 } from "@dcl/sdk/math";
import { Material, engine, MaterialTransparencyMode } from "@dcl/sdk/ecs";

export const colors = [
    Color4.Red(),
    Color4.Blue(),
    Color4.Green(),
    Color4.Clear(),
    Color4.Magenta(),
    Color4.Purple(),
    Color4.Red(),
    Color4.Teal(),
    Color4.White(),
    Color4.Yellow()
    // Add more colors as needed
];

export let currentColorIndex = 0; // Initialize default color index

export function changeHeartColor() {
  // Increment color index or loop back to start
  currentColorIndex = (currentColorIndex + 1) % colors.length;
  const selectedColor = colors[currentColorIndex];

  const heartEntities = engine.getEntitiesWith(Material);
  for (const [entity] of heartEntities) {
    const material = Material.getMutable(entity);
    if (material) {
      Material.setPbrMaterial(entity, {
        texture: Material.Texture.Common({
          src: 'assets/heart.png'
        }),
        emissiveTexture: Material.Texture.Common({
          src: 'assets/heart.png'
        }),
        emissiveColor: selectedColor, // Use the selected color here
        emissiveIntensity: emission, // Use the emission value here
        roughness: 1,
        specularIntensity: 0,
        alphaTexture: Material.Texture.Common({
          src: 'assets/heart.png'
        }),
        transparencyMode: MaterialTransparencyMode.MTM_ALPHA_TEST,
        alphaTest: 0.1
      });;
    }
  }
}

export let selectedColor = colors[Math.floor(Math.random() * colors.length)];

export const minEmission = 1.1; // Minimum emission value
export const maxEmission = 3; // Maximum emission value

export let emission = Math.random() * (maxEmission - minEmission) + minEmission;
