import { useState } from 'react'
import Map from './components/Map.jsx'
import tiposOSM from './tipoOSM.json'

function App() {
  const [nodes, setNodes] = useState([])
  const [search, setSearch] = useState("")

  // Diccionario de búsqueda español → tags OSM
/*const tiposOSM = {
  cafe: { key: "amenity", value: "cafe" },
  restaurante: { key: "amenity", value: "restaurant" },
  barberia: { key: "shop", value: "hairdresser" },
  peluqueria: { key: "shop", value: "hairdresser" },
  farmacia: { key: "amenity", value: "pharmacy" },
};*/

  const fetchData = async () =>{
    if(!search) return

    const tipo = tiposOSM[search.toLowerCase()];
    if (!tipo) {
    console.warn("No hay tag OSM para esa búsqueda");
    setNodes([]);
    return;
  }
    try {
      const query = `
        [out:json];
        (
          node["${tipo.key}"="${tipo.value}"](40.41,-3.70,40.42,-3.68);
          way["${tipo.key}"="${tipo.value}"](40.41,-3.70,40.42,-3.68);
          relation["${tipo.key}"="${tipo.value}"](40.41,-3.70,40.42,-3.68);
        );
        out center;
      `;
      const response = await fetch(
        "https://overpass-api.de/api/interpreter",
        {
          method:"POST",
          body:query,
        },
        3,
        1500
      )


      const contentType = response.headers.get("content-type");

        if (!contentType || !contentType.includes("application/json")) {
            const text = await response.text();

            console.error("No es JSON:", text);
        return;
        }

        const data = await response.json();
        console.log(data)
        setNodes(data.elements)
    } catch (error) {
      console.error("Error:", error);
    }
  }

  /*useEffect(()=>{
    const fetchData = async () =>{
      try {
        const response = await fetch('https://overpass.kumi.systems/api/interpreter?data=[out:json];node["amenity"="cafe"](40.4,-3.7,40.5,-3.6);out;')
        const contentType = response.headers.get("content-type");

        if (!contentType || !contentType.includes("application/json")) {
            const text = await response.text();
            console.error("No es JSON:", text);
        return;
        }

        const data = await response.json();
        console.log(data)
        setNodes(data.elements)
      } catch (error) {
        console.error('Error en overpass',error)
      }
    }

    fetchData();
  },[])*/

  return (
    <div>
      <h1>Buscador de lugares</h1>

      <input
        type="text"
        placeholder="cafe, restaurant..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border border-gray-300 rounded px-4 py-2"
      />

      <button onClick={fetchData} className="bg-green-500 text-white px-5 py-2 rounded shadow-lg hover:bg-green-600 active:scale-95 transition transform">
        Buscar
      </button>

      <Map nodes={nodes} />
    </div>
  )
}

export default App