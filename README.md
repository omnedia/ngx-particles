# ngx-particles

`@omnedia/ngx-particles` is an Angular library that provides a dynamic and interactive particle animation effect. The particles react to mouse movements, creating a visually engaging and customizable background for your Angular components.

## Features

- Interactive particle animation that responds to mouse movements.
- Customizable particle quantity, size, color, and motion dynamics.
- Lightweight and easy to integrate as a standalone component.

## Installation

Install the library using npm:

```bash
npm install @omnedia/ngx-particles
```

## Usage

Import the `NgxParticlesComponent` in your Angular module or component:

```typescript
import { NgxParticlesComponent } from '@omnedia/ngx-particles';

@Component({
  ...
  imports: [
    ...
    NgxParticlesComponent,
  ],
  ...
})
```

Use the component in your template:

```html
<om-particles
  [quantity]="150"
  [size]="0.5"
  [circleColor]="'#ff69b4'"
  [staticity]="60"
  [ease]="40"
  [particleSpeed]="1"
  [vx]="0.1"
  [vy]="0.1"
  styleClass="custom-particles"
>
  <h1>Your content here</h1>
</om-particles>
```

## API

```html
<om-particles
  [quantity]="quantity"
  [size]="size"
  [circleColor]="circleColor"
  [staticity]="staticity"
  [ease]="ease"
  [particleSpeed]="particleSpeed"
  [vx]="vx"
  [vy]="vy"
  styleClass="your-custom-class"
>
  <ng-content></ng-content>
</om-particles>
```

- `quantity` (optional): The number of particles. Defaults to 100.
- `size` (optional): The size of the particles. Defaults to 0.4.
- `circleColor` (optional): The color of the particles. Accepts any valid CSS color value (e.g., '#ff69b4', 'rgba(255, 105, 180, 0.8)'). Default is white
- `staticity` (optional): Controls the responsiveness of the particles to the mouse. Higher values reduce particle movement. Defaults to 50.
- `ease` (optional): Controls the smoothness of the particle movement. Lower values increase the speed of the transition. Defaults to 50.
- `particleSpeed` (optional): Controls the speed of the particle movement. Higher values increase the speed of the particles. Defaults to 1.
- `vx` (optional): Horizontal velocity of the particles. Defaults to 0.
- `vy` (optional): Vertical velocity of the particles. Defaults to 0.
- `styleClass` (optional): A custom CSS class to apply to the particle container.

## Example

```html
<om-particles
  [quantity]="200"
  [size]="0.6"
  [circleColor]="'#00ffcc'"
  [staticity]="70"
  [ease]="30"
  [particleSpeed]="2"
  [vx]="0.05"
  [vy]="0.05"
  styleClass="particles-background"
>
  <div class="content">Interactive Particle Background</div>
</om-particles>
```

This example creates a particle background with 200 particles, cyan-colored, and with custom motion dynamics. The particles will move more fluidly in response to mouse movements.

## Styling

To further customize the appearance of the particles or the container, use the styleClass input to apply your own CSS classes.

```css
.particles-background {
  background-color: #000;
  position: relative;
  height: 100vh;
  overflow: hidden;
}

.content {
  position: relative;
  z-index: 1;
  color: white;
  text-align: center;
  padding-top: 50px;
}
```

This will create a fullscreen particle background with a centered text content overlay.

## Contributing

Contributions are welcome. Please submit a pull request or open an issue to discuss your ideas.

## License

This project is licensed under the MIT License.