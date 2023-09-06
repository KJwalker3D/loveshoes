import { Color3, Color4 } from "@dcl/sdk/math";
import { Material } from "@dcl/sdk/ecs";

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
  

export const selectedColor = colors[Math.floor(Math.random() * colors.length)];


export const minEmission = 0.5; // Minimum emission value
export const maxEmission = 2.0; // Maximum emission value

export let emission = Math.random() * (maxEmission - minEmission) + minEmission;


