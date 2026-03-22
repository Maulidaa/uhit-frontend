import { MapContainer, TileLayer } from "react-leaflet"
import MapLayer from "./MapLayer"

export default function MapView(){

 return(

<MapContainer
 center={[-2.5,118]}
 zoom={5}
 style={{height:"100%", width:"100%"}}
 zoomAnimation={true}
 fadeAnimation={true}
 markerZoomAnimation={true}
 zoomSnap={0.25}
 wheelDebounceTime={60}
 wheelPxPerZoomLevel={120}
>

<TileLayer
 url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
/>

<MapLayer/>

</MapContainer>

 )

}