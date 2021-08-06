import React, {
  memo,
  useCallback,
  useEffect, useMemo, useState,
} from 'react';
import {
  GoogleApiWrapper, Map, Marker, InfoWindow, Polygon,
} from 'google-maps-react';
import { kml } from '@tmcw/togeojson';
import randomColor from 'randomcolor';
import GeneralInfoWindow from '../GeneralInfoWindow';
import { getCenterFromPolygon } from '../../utils';

const MapContainer = (props) => {
  const { google } = props;
  const [kmlToJson, setKmlToJson] = useState([]);
  const [ubs, setUbs] = useState([]);
  const [microAreas, setMicroAreas] = useState([]);
  const [isShowInfoWindow, setIsShowInfoWindow] = useState(false);
  const [activeFeature, setActiveFeature] = useState({ ubs: false, mca: false, feature: null });
  const CNES = { r01: { cnes: '3387682' } };

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
    console.log('activeFeature', activeFeature);
  }, [activeFeature]);

  useEffect(() => {
    if (kmlToJson.length > 0) {
      const ubsTemp = kmlToJson.filter(
        (feature) => feature.geometry.type === 'Point',
      );
      setUbs(ubsTemp);

      const microAreasTemp = kmlToJson.filter((feature) => feature.geometry.type === 'Polygon' && 'ACS' in feature.properties).map((microArea) => {
        const color = randomColor();
        return {
          ...microArea,
          style: {
            fillColor: color,
            strokeOpacity: 1,
            strokeWeight: 1,
            strokeColor: '#fff',
            fillOpacity: 0.6,
          },
          id: microArea.properties.INE + microArea.properties.name,
        };
      });
      setMicroAreas(microAreasTemp);
    }
  }, [kmlToJson]);

  const onInfoWindowClose = () => {
    setIsShowInfoWindow(false);
    setActiveFeature({ ubs: false, mca: false, feature: null });
  };

  const onMapClicked = () => {
    if (isShowInfoWindow) {
      setIsShowInfoWindow(false);
      setActiveFeature({ ubs: false, mca: false, feature: null });
    }
  };

  const handleMarkerHover = (metadata, marker, e) => {
    const m = ubs.find(
      (currentMarker) => currentMarker.properties.CNES.trim() === marker.cnesUBS.trim(),
    );

    marker.setOptions({ animation: true });
    setActiveFeature({ ubs: true, mca: false, feature: marker });
    setIsShowInfoWindow(true);
    return false;
  };

  const handleMarkerOut = (metadata, marker, e) => {
    setIsShowInfoWindow(false);
    setActiveFeature({ ubs: false, mca: false, feature: null });
    return false;
  };

  const handlePolygonOut = (metadata, polygon, e) => {
    const m = microAreas.find(
      (currentMicroArea) => polygon.id === currentMicroArea.id,
    );
    polygon.setOptions(m.style);
    setIsShowInfoWindow(false);
    setActiveFeature({ ubs: false, mca: false, feature: null });
  };

  const handlePolygonHover = (metadata, polygon, e) => {
    polygon.setOptions({
      fillOpacity: 0.8, strokeWeight: 3,
    });
    const micro = microAreas.find((microarea) => microarea.id === polygon.id);

    setActiveFeature({ ubs: false, mca: true, feature: micro });
    setIsShowInfoWindow(true);
  };

  const renderMarkers = () => ubs.map((currentUbs) => (
    <Marker
      onMouseout={handleMarkerOut}
      onMouseover={handleMarkerHover}
      key={currentUbs.properties.CNES}
      id={currentUbs.properties.CNES}
      nomeUbs={currentUbs.properties.name}
      cnesUBS={currentUbs.properties.CNES.trim()}
      position={{
        lat: currentUbs.geometry.coordinates[1],
        lng: currentUbs.geometry.coordinates[0],
      }}
    />
  ));

  const renderPolygon = () => microAreas.map((microArea) => (
    <Polygon
      onMouseout={handlePolygonOut}
      nome={microArea.properties.name}
      onMouseover={handlePolygonHover}
      key={microArea.id}
      paths={microArea.geometry.coordinates[0].map((item) => ({
        lng: item[0],
        lat: item[1],
      }))}
      {...microArea.style}
      id={microArea.id}
    />
  ));

  return (
    <Map
      onClick={onMapClicked}
      mapTypeControl={false}
      google={google}
      initialCenter={centerMapCoordinates}
      zoom={15}
      style={{ height: '100%', position: 'relative', width: '100%' }}
    >
      {ubs.length > 0 && renderMarkers()}

      {microAreas.length > 0 && renderPolygon()}

      {activeFeature.feature && (
        <InfoWindow
          marker={activeFeature.ubs && activeFeature.feature}
          visible={isShowInfoWindow}
          onClose={onInfoWindowClose}
          position={activeFeature.mca && getCenterFromPolygon(activeFeature.feature.geometry.coordinates[0])}
        >
          <div>
            <strong>{activeFeature.feature && activeFeature.feature.properties && activeFeature.feature.properties.name}</strong>
            <strong>{activeFeature.feature && activeFeature.feature.nomeUbs}</strong>
          </div>
        </InfoWindow>
      )}

    </Map>
  );
};

const Mapa = GoogleApiWrapper({
  apiKey: process.env.REACT_APP_MAP_KEY,
  language: 'pt-BR',
})(MapContainer);

export default Mapa;
