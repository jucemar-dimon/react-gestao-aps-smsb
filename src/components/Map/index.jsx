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
import { getCenterFromPolygon } from '../../utils';

const MapContainer = (props) => {
  const { google } = props;
  const [kmlToJson, setKmlToJson] = useState([]);

  const [isShowInfoWindow, setIsShowInfoWindow] = useState(false);
  const [activeFeature, setActiveFeature] = useState({ ubs: false, mca: false, feature: null });
  const CNES = { r01: { cnes: '3387682' } };
  const [microAreas, setMicroAreas] = useState([]);

  const ubs = useMemo(() => {
    const ubsTemp = kmlToJson.filter(
      (feature) => feature.geometry.type === 'Point',
    );
    return ubsTemp;
  }, [kmlToJson]);

  const centerMapCoordinates = { lat: -27.5136608, lng: -48.6434893 };

  useEffect(() => {
    fetch('mapa.kml')
      .then((response) => response.text())
      .then((xml) => kml(new DOMParser().parseFromString(xml, 'text/xml')))
      .then((json) => {
        setKmlToJson([...json.features]);
      });
  }, []);

  useEffect(() => {
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
    setMicroAreas([...microAreasTemp]);
  }, [kmlToJson]);

  useEffect(() => {
    /*     console.log('process.env.REACT_APP_MAP_KML', process.env.REACT_APP_MAP_KML);
    console.log('teste-activeFeature', activeFeature); */
    // console.log('teste-ubs', ubs.length);
    // console.log('teste-microAreas', microAreas.length);
  }, [activeFeature]);

  const onInfoWindowClose = () => {
    setIsShowInfoWindow(false);
    setActiveFeature({ ubs: false, mca: false, feature: null });
  };

  const handleMarkerClick = (metadata, marker, e) => {
    setActiveFeature({ ubs: true, mca: false, feature: marker });
    setIsShowInfoWindow(true);
  };

  const handlePolygonClick = (metadata, polygon, e) => {
    const baseMicroarea = microAreas.find(
      (currentMicroArea) => polygon.id === currentMicroArea.id,
    );
    setActiveFeature({ ubs: false, mca: true, feature: baseMicroarea });
    setIsShowInfoWindow(true);
  };

  const handlePolygonOut = (metadata, polygon, e) => {
    const m = microAreas.find(
      (currentMicroArea) => polygon.id === currentMicroArea.id,
    );
    polygon.setOptions(m.style);
  };

  const handlePolygonHover = (metadata, polygon, e) => {
    polygon.setOptions({
      fillOpacity: 0.8, strokeWeight: 3,
    });
  };

  const renderMarkers = useCallback(() => ubs.map((currentUbs) => (
    <Marker
      onClick={handleMarkerClick}
      key={currentUbs.properties.CNES}
      id={currentUbs.properties.CNES}
      nomeUbs={currentUbs.properties.name}
      cnesUBS={currentUbs.properties.CNES.trim()}
      position={{
        lat: currentUbs.geometry.coordinates[1],
        lng: currentUbs.geometry.coordinates[0],
      }}
    />
  )), [ubs]);

  const renderPolygon = useCallback(() => microAreas.map((microArea) => (
    <Polygon
      onClick={handlePolygonClick}
      onMouseout={handlePolygonOut}
      nome={microArea.properties.name}
      onMouseover={handlePolygonHover}
      key={microArea.id}
      paths={microArea.geometry.coordinates[0].map((item) => ({
        lng: item[0],
        lat: item[1],
      }))}
      fillColor={microArea.style.fillColor}
      strokeOpacity={microArea.style.strokeOpacity}
      strokeWeight={microArea.style.strokeWeight}
      strokeColor={microArea.style.strokeColor}
      fillOpacity={microArea.style.fillOpacity}
      id={microArea.id}
    />
  )), [microAreas]);

  const renderInfoWindow = useCallback(() => {
    if (activeFeature.ubs) {
      return (
        <InfoWindow
          marker={activeFeature.feature}
          visible={isShowInfoWindow}
          onClose={onInfoWindowClose}
        >
          <>
            <div>
              <h2>{activeFeature.feature && activeFeature.feature.properties && activeFeature.feature.properties.name}</h2>
              <h2>{activeFeature.feature && activeFeature.feature.nomeUbs}</h2>
            </div>
            <span>{activeFeature.feature && `CNES: ${activeFeature.feature.nomeUbs}`}</span>

          </>
        </InfoWindow>
      );
    }
    return (
      <InfoWindow
        position={getCenterFromPolygon(activeFeature.feature.geometry.coordinates[0])}
        visible={isShowInfoWindow}
        onClose={onInfoWindowClose}
      >
        <div>
          <strong>{activeFeature.feature && activeFeature.feature.properties && activeFeature.feature.properties.name}</strong>
          <strong>{activeFeature.feature && activeFeature.feature.nomeUbs}</strong>
        </div>
      </InfoWindow>
    );
  }, [activeFeature]);

  return (
    <Map
      mapTypeControl={false}
      google={google}
      initialCenter={centerMapCoordinates}
      zoom={15}
      scaleControl={false}
      fullscreenControl={false}

    >
      {ubs.length > 0 && renderMarkers()}

      {microAreas.length > 0 && renderPolygon()}

      {activeFeature.feature && renderInfoWindow()}

    </Map>
  );
};

const Mapa = GoogleApiWrapper({
  apiKey: process.env.REACT_APP_MAP_KEY,
  language: 'pt-BR',
})(MapContainer);

export default Mapa;
