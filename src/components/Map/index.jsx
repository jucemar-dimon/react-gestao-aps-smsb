import React, {
  useEffect, useState,
} from 'react';
import {
  GoogleApiWrapper, Map, Marker, InfoWindow, Polygon,
} from 'google-maps-react';
import { kml } from '@tmcw/togeojson';
import randomColor from 'randomcolor';

const MapContainer = (props) => {
  const { google } = props;
  const [kmlToJson, setKmlToJson] = useState([]);
  const [ubsMarkers, setUbsMarkers] = useState([]);
  const [microAreas, setMicroAreas] = useState([]);
  const [showingInfoWindow, setShowingInfoWindow] = useState(false);
  const [activeMarker, setActiveMarker] = useState({});

  const centerMapCoordinates = { lat: -27.5136608, lng: -48.6434893 };

  useEffect(() => {
    fetch(
      'https://www.google.com/maps/d/u/0/kml?forcekml=1&mid=1TKLlG3A8R-BqIq7GdB5DxYZTU7V6fZwr',
    )
      .then((response) => response.text())
      .then((xml) => kml(new DOMParser().parseFromString(xml, 'text/xml')))
      .then((json) => {
        setKmlToJson([...json.features]);
      });
  }, []);

  useEffect(() => {
    if (kmlToJson.length > 0) {
      const points = kmlToJson.filter(
        (feature) => feature.geometry.type === 'Point',
      );
      setUbsMarkers([...points]);

      const polygons = kmlToJson.filter((feature) => feature.geometry.type === 'Polygon' && 'INE' in feature.properties);
      setMicroAreas(polygons);
      console.log('kmlToJson', kmlToJson);
    }
  }, [kmlToJson]);

  const handleMarkerHover = (propss, marker, e) => {
    setActiveMarker(marker);
    setShowingInfoWindow(true);
  };

  const onMapClicked = () => {
    if (showingInfoWindow) {
      setShowingInfoWindow(false);
      setActiveMarker({});
    }
  };

  const onInfoWindowClose = () => {
    setShowingInfoWindow(false);
    setActiveMarker({});
  };

  return (
    <Map
      mapTypeControl={false}
      google={google}
      initialCenter={centerMapCoordinates}
      zoom={15}
      style={{ height: '100%', position: 'relative', width: '100%' }}
    >
      {ubsMarkers.length > 0
        && ubsMarkers.map((marker) => (
          <Marker
            onMouseout={onMapClicked}
            onMouseover={handleMarkerHover}
            key={marker.properties.CNES}
            nomeUbs={marker.properties.name}
            cnesUBS={marker.properties.CNES}
            position={{
              lat: marker.geometry.coordinates[1],
              lng: marker.geometry.coordinates[0],
            }}
          />
        ))}

      {true && microAreas.map((polygon) => {
        const color = randomColor();
        return (
          <Polygon
            paths={polygon.geometry.coordinates[0].map((item) => ({
              lng: item[0],
              lat: item[1],
            }))}
            strokeColor={color}
            strokeOpacity={0.8}
            strokeWeight={1.5}
            fillColor={color}
            fillOpacity={0.5}
          />
        );
      })}
      <InfoWindow
        marker={activeMarker}
        visible={showingInfoWindow}
        onClose={onInfoWindowClose}
      >
        {Object.keys(activeMarker).length > 0 && (

          <div>
            <h1>{activeMarker.nomeUbs}</h1>
            <span>
              <strong>CNES:</strong>
              {` ${activeMarker.cnesUBS}`}
            </span>
          </div>
        )}
      </InfoWindow>
    </Map>
  );
};

export default GoogleApiWrapper({
  apiKey: process.env.REACT_APP_MAP_KEY,
  language: 'pt-BR',
})(MapContainer);
