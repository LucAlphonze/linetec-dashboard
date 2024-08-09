import { Injectable } from '@angular/core';
import colorLib from '@kurkle/color';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  constructor() {}
  private CHART_COLORS = {
    strong_blue: '#062984',
    medium_blue: '#1758FF',
    light_blue: '#6F97FF',
    red: 'rgb(255, 99, 132)',
    orange: 'rgb(255, 159, 64)',
    yellow: 'rgb(255, 205, 86)',
    green: 'rgb(75, 192, 192)',
    blue: 'rgb(54, 162, 235)',
    purple: 'rgb(153, 102, 255)',
    grey: 'rgb(201, 203, 207)',
  };

  NAMED_COLORS = [
    this.CHART_COLORS.strong_blue,
    this.CHART_COLORS.medium_blue,
    this.CHART_COLORS.light_blue,
    this.CHART_COLORS.red,
    this.CHART_COLORS.orange,
    this.CHART_COLORS.yellow,
    this.CHART_COLORS.green,
    this.CHART_COLORS.blue,
    this.CHART_COLORS.purple,
    this.CHART_COLORS.grey,
  ];

  namedColor(index: number) {
    return this.NAMED_COLORS[index % this.NAMED_COLORS.length];
  }
  transparentize(value: string, opacity: number) {
    var alpha = opacity === undefined ? 0.5 : 1 - opacity;
    return colorLib(value).alpha(alpha).rgbString();
  }
}
