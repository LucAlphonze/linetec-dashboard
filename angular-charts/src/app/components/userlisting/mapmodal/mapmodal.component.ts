import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Map, MapStyle, Marker, config, geocoding } from '@maptiler/sdk';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-mapmodal',
  templateUrl: './mapmodal.component.html',
  styleUrls: ['./mapmodal.component.css'],
})
export class MapmodalComponent implements OnInit, AfterViewInit {
  constructor(
    public dialogRef: MatDialogRef<MapmodalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  map!: Map;
  marker!: Marker;
  markerResults!: string;

  @ViewChild('map') mapContainer!: ElementRef<HTMLElement>;

  ngOnInit(): void {
    config.apiKey = environment.MAPTILER_API_KEY;
  }

  ngAfterViewInit(): void {
    const initialState = { lng: -64.1888, lat: -31.4201, zoom: 14 };

    this.map = new Map({
      container: this.mapContainer.nativeElement,
      style: MapStyle.STREETS,
      center: [initialState.lng, initialState.lat],
      zoom: initialState.zoom,
    });
    this.marker = new Marker({ color: '#FF0000', draggable: true })
      .setLngLat([-64.1888, -31.4201])
      .addTo(this.map);
    this.marker.on('dragend', async (e) => {
      const { lng, lat } = e.target._lngLat;
      const results = await geocoding.reverse([lng, lat]);
      this.markerResults = `${results.features[0].text} ${results.features[0].address}`;
      console.log('resultados', results.features[0]);
      // const map: any = e.target;
      // map.getSource('search-results').setData(results);
    });
  }
  saveAddress(): void {
    this.dialogRef.close(this.markerResults);
  }
}
