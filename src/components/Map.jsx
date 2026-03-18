import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const Map = ({nodes}) =>{
    return(
        <MapContainer center={[40.4168, -3.7038]} zoom={13} className='w-full h-screen'>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {nodes
                .filter(node => (node.lat && node.lon) || (node.center && node.center.lat && node.center.lon))
                .map(node => {
                    const lat = node.lat ?? node.center?.lat;
                    const lon = node.lon ?? node.center?.lon;
                    return (
                        <Marker key={node.id} position={[lat, lon]}>
                            <Popup>{node.tags?.name || "Sin nombre"}</Popup>
                        </Marker>
                    );
      })}
        </MapContainer>
    )
}
export default Map