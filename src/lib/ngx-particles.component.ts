import {CommonModule, isPlatformBrowser} from "@angular/common";
import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  Inject,
  Input,
  OnDestroy,
  PLATFORM_ID,
  ViewChild,
} from "@angular/core";
import {Circle} from "./ngx-particles.types";

@Component({
  selector: "om-particles",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./ngx-particles.component.html",
  styleUrl: "./ngx-particles.component.scss",
})
export class NgxParticlesComponent implements AfterViewInit, OnDestroy {
  @ViewChild("OmParticlesCanvas")
  canvasRef!: ElementRef<HTMLCanvasElement>;

  @ViewChild("OmParticlesWrapper")
  wrapperRef!: ElementRef<HTMLElement>;

  @Input("quantity")
  quantity = 100;

  @Input("size")
  size = 0.4;

  @Input("circleColor")
  color = "#ffffff";

  @Input("staticity")
  staticity = 50;

  @Input("ease")
  ease = 50;

  @Input("particleSpeed")
  particleSpeed = 1;

  @Input("vx")
  vx = 0;

  @Input("vy")
  vy = 0;

  private mousePosition: { x: number; y: number } = {x: 0, y: 0};
  private mouse: { x: number; y: number } = {x: 0, y: 0};

  private circles: Circle[] = [];

  @HostListener("mousemove", ["$event"])
  onClick(event: MouseEvent) {
    this.mousePosition = {
      x: event.clientX,
      y: event.clientY,
    };

    this.onMouseMove();
  }

  private isInView = false;
  private isAnimating = false;
  private animationFrameId?: number;
  private intersectionObserver?: IntersectionObserver;

  constructor(
    @Inject(PLATFORM_ID) private platformId: object
  ) {
  }

  ngAfterViewInit(): void {
    this.setCanvasSize();
    this.animate();

    if (isPlatformBrowser(this.platformId)) {
      this.intersectionObserver = new IntersectionObserver(([entry]) => {
        this.renderContents(entry.isIntersecting);
      });
      this.intersectionObserver.observe(this.canvasRef.nativeElement);
    }

    window.addEventListener("resize", () => this.setCanvasSize());
  }

  ngOnDestroy(): void {
    window.removeEventListener("resize", () => this.setCanvasSize());

    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }

    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }

  renderContents(isIntersecting: boolean) {
    if (isIntersecting && !this.isInView) {
      this.isInView = true;

      if (!this.isAnimating) {
        this.animationFrameId = requestAnimationFrame(() => this.animate());
      }
    } else if (!isIntersecting) {
      this.isInView = false;
    }
  }

  private setCanvasSize(): void {
    this.canvasRef.nativeElement.width =
      this.wrapperRef.nativeElement.getBoundingClientRect().width;
    this.canvasRef.nativeElement.height =
      this.wrapperRef.nativeElement.getBoundingClientRect().height;

    this.circles = [];
    this.drawParticles();
  }

  private drawParticles(): void {
    this.clearContext();

    for (let i = 0; i < this.quantity; i++) {
      const circle = this.circleParams();
      this.drawCircle(circle);
    }
  }

  private circleParams(): Circle {
    const x = Math.floor(Math.random() * this.canvasRef.nativeElement.width);
    const y = Math.floor(Math.random() * this.canvasRef.nativeElement.height);
    const translateX = 0;
    const translateY = 0;
    const pSize = Math.floor(Math.random() * 2) + this.size;
    const alpha = 0;
    const targetAlpha = parseFloat((Math.random() * 0.6 + 0.1).toFixed(1));
    const dx = (Math.random() - 0.5) * 0.1;
    const dy = (Math.random() - 0.5) * 0.1;
    const magnetism = 0.1 + Math.random() * 4;

    return {
      x,
      y,
      translateX,
      translateY,
      size: pSize,
      alpha,
      targetAlpha,
      dx,
      dy,
      magnetism,
    };
  }

  private drawCircle(circle: Circle, update = false): void {
    const context = this.canvasRef.nativeElement.getContext("2d");

    if (!context) {
      return;
    }

    const {x, y, translateX, translateY, size, alpha} = circle;
    const rgb = this.hexToRgb(this.color);

    context.translate(translateX, translateY);
    context.beginPath();
    context.arc(x, y, size, 0, 2 * Math.PI);
    context.fillStyle = `rgba(${rgb.join(", ")}, ${alpha})`;
    context.fill();
    context.setTransform(1, 0, 0, 1, 0, 0);

    if (!update) {
      this.circles.push(circle);
    }
  }

  private animate(): void {
    if (!this.isInView) {
      this.isAnimating = false;
      return;
    }

    this.isAnimating = true;

    this.clearContext();

    this.circles.forEach((circle: Circle, i: number) => {
      // Handle the alpha value
      const edge = [
        circle.x + circle.translateX - circle.size, // distance from left edge
        this.canvasRef.nativeElement.width -
        circle.x -
        circle.translateX -
        circle.size, // distance from right edge
        circle.y + circle.translateY - circle.size, // distance from top edge
        this.canvasRef.nativeElement.height -
        circle.y -
        circle.translateY -
        circle.size, // distance from bottom edge
      ];

      const closestEdge = edge.reduce((a, b) => Math.min(a, b));
      const remapClosestEdge = parseFloat(
        this.remapValue(closestEdge, 0, 20, 0, 1).toFixed(2)
      );

      if (remapClosestEdge > 1) {
        circle.alpha += 0.02;
        if (circle.alpha > circle.targetAlpha) {
          circle.alpha = circle.targetAlpha;
        }
      } else {
        circle.alpha = circle.targetAlpha * remapClosestEdge;
      }

      circle.x += (circle.dx + this.vx) * this.particleSpeed;
      circle.y += (circle.dy + this.vy) * this.particleSpeed;
      circle.translateX +=
        (this.mouse.x / (this.staticity / circle.magnetism) -
          circle.translateX) /
        this.ease;
      circle.translateY +=
        (this.mouse.y / (this.staticity / circle.magnetism) -
          circle.translateY) /
        this.ease;

      this.drawCircle(circle, true);

      // circle gets out of the canvas
      if (
        circle.x < -circle.size ||
        circle.x > this.canvasRef.nativeElement.width + circle.size ||
        circle.y < -circle.size ||
        circle.y > this.canvasRef.nativeElement.height + circle.size
      ) {
        // remove the circle from the array
        this.circles.splice(i, 1);
        // create a new circle
        const newCircle = this.circleParams();
        this.drawCircle(newCircle);
        // update the circle position
      }
    });

    this.animationFrameId = requestAnimationFrame(() => this.animate());
  }

  private clearContext(): void {
    const context = this.canvasRef.nativeElement.getContext("2d");

    if (!context) {
      return;
    }

    context.clearRect(
      0,
      0,
      this.canvasRef.nativeElement.width,
      this.canvasRef.nativeElement.height
    );
  }

  private onMouseMove(): void {
    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    const {w, h} = {
      w: this.canvasRef.nativeElement.width,
      h: this.canvasRef.nativeElement.height,
    };

    const x = this.mousePosition.x - rect.left - w / 2;
    const y = this.mousePosition.y - rect.top - h / 2;

    const inside = x < w / 2 && x > -w / 2 && y < h / 2 && y > -h / 2;

    if (inside) {
      this.mouse = {x: x, y: y};
    }
  }

  private remapValue(
    value: number,
    start1: number,
    end1: number,
    start2: number,
    end2: number
  ): number {
    const remapped =
      ((value - start1) * (end2 - start2)) / (end1 - start1) + start2;

    return remapped > 0 ? remapped : 0;
  }

  private hexToRgb(hex: string): number[] {
    hex = hex.replace("#", "");

    if (hex.length === 3) {
      hex = hex
        .split("")
        .map((char) => char + char)
        .join("");
    }

    const hexInt = parseInt(hex, 16);
    const red = (hexInt >> 16) & 255;
    const green = (hexInt >> 8) & 255;
    const blue = hexInt & 255;
    return [red, green, blue];
  }
}
