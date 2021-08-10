/* eslint-disable react/jsx-props-no-spreading */
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

const MapContainer = (props) => {
  const { google, map, mapCenter } = props;
  const [kmlToJson, setKmlToJson] = useState([]);

  const [isShowInfoWindow, setIsShowInfoWindow] = useState(false);
  const [activeFeature, setActiveFeature] = useState({ ubs: false, mca: false, feature: null });
  const CNES = { r01: { cnes: '3387682' } };
  const [microAreas, setMicroAreas] = useState([]);

  const ubs = useMemo(() => {
    const ubsTemp = kmlToJson.filter(
      (feature) => feature.geometry.type === 'Point',
    ).map((point) => ({
      position: { lat: point.geometry.coordinates[1], lng: point.geometry.coordinates[0] },
      cnes: point.properties.CNES,
      nomeEstabelecimento: point.properties.name,
    }));
    console.log('ubsTemp', ubsTemp);
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
      const codigoMicroarea = microArea.properties.name.slice(-2, microArea.properties.name.length);
      return {

        style: {
          fillColor: color,
          strokeOpacity: 1,
          strokeWeight: 1,
          strokeColor: '#fff',
          fillOpacity: 0.6,
        },
        id: `${microArea.properties.CNES}-${microArea.properties.INE}-${microArea.properties.Área}-${codigoMicroarea}`,
        microarea: codigoMicroarea,
        cnes: microArea.properties.CNES,
        area: microArea.properties.Área,
        acs: microArea.properties.ACS,
        ine: microArea.properties.INE,
        nomeEquipe: microArea.properties['Nome da equipe'],
        nomeEstabelecimento: microArea.properties.Estabelecimento,
        paths: microArea.geometry.coordinates[0].map((item) => ({
          lng: item[0],
          lat: item[1],
        })),

      };
    });
    setMicroAreas([...microAreasTemp]);
    console.log('microAreas', microAreasTemp);
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
      key={currentUbs.cnes}
      id={currentUbs.cnes}
      cnes={currentUbs.cnes}
      position={currentUbs.position}
      nomeEstabelecimento={currentUbs.nomeEstabelecimento}
    />
  )), [ubs]);

  const renderPolygon = useCallback(() => microAreas.map((microArea) => (
    <Polygon
      onClick={handlePolygonClick}
      onMouseout={handlePolygonOut}
      nomeEstabelecimento={microArea.nomeEstabelecimento}
      onMouseover={handlePolygonHover}
      key={microArea.id}
      paths={microArea.paths}
      fillColor={microArea.style.fillColor}
      strokeOpacity={microArea.style.strokeOpacity}
      strokeWeight={microArea.style.strokeWeight}
      strokeColor={microArea.style.strokeColor}
      fillOpacity={microArea.style.fillOpacity}
      id={microArea.id}
    />
  )), [microAreas]);

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

      <GeneralInfoWindow map={map} google={google} mapCenter={mapCenter} ubs={activeFeature.ubs} mca={activeFeature.mca} feature={activeFeature.feature} isShowInfoWindow={isShowInfoWindow} />

    </Map>
  );
};

const Mapa = GoogleApiWrapper({
  apiKey: process.env.REACT_APP_MAP_KEY,
  language: 'pt-BR',
})(MapContainer);

export default Mapa;
