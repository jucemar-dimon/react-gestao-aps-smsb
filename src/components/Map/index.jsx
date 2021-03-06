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
import { FcHome } from 'react-icons/fc';
import GeneralInfoWindow from '../GeneralInfoWindow';
import Modal from '../Modal';
import ubsIcon from '../../assets/images/ubs.png';
import { colors, cnes } from '../../utils';
import { MapStyled } from './styles';

const MapContainer = (props) => {
  const { google, map, mapCenter } = props;
  const [kmlToJson, setKmlToJson] = useState([]);

  const [isShowInfoWindow, setIsShowInfoWindow] = useState(false);
  const [activeFeature, setActiveFeature] = useState({ ubs: false, mca: false, feature: null });

  const [microAreas, setMicroAreas] = useState([]);
  const [isShowModal, setIsShowModal] = useState(false);

  const ubs = useMemo(() => {
    const ubsTemp = kmlToJson.filter(
      (feature) => feature.geometry.type === 'Point',
    ).map((point) => ({
      position: { lat: point.geometry.coordinates[1], lng: point.geometry.coordinates[0] },
      cnes: point.properties.CNES,
      nomeEstabelecimento: point.properties.name,
    }));
    // console.log('ubsTemp', ubsTemp);
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
    const microAreasNude = kmlToJson.filter((feature) => feature.geometry.type === 'Polygon' && 'ACS' in feature.properties).map((microArea) => {
      const codigoMicroarea = microArea.properties.name.slice(-2, microArea.properties.name.length);
      return {
        id: `${microArea.properties.CNES}-${microArea.properties.INE}-${microArea.properties.??rea}-${codigoMicroarea}`,
        microarea: codigoMicroarea,
        cnes: microArea.properties.CNES,
        area: microArea.properties.??rea,
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
    // eslint-disable-next-line prefer-const
    let areas = {};
    const microAreasColorized = [];
    microAreasNude.forEach((item) => {
      if (areas[item.cnes]) {
        areas[item.cnes].push(item);
      } else {
        areas[item.cnes] = [item];
      }
    });
    // console.log('areas', areas);
    const keys = Object.keys(areas);
    // console.log('keys', keys);
    const colorizedAreas = {};
    keys.forEach((key) => {
      const colorsForCurrentMicroarea = colors[key];

      areas[key].forEach((nudeMicroArea, index) => {
        const colorsOfMicroArea = colorsForCurrentMicroarea;
        microAreasColorized.push({
          ...nudeMicroArea,
          style: {
            fillColor: colorsOfMicroArea,
            strokeOpacity: 1,
            strokeWeight: 1,
            strokeColor: '#fff',
            fillOpacity: 1,
          },
        });
      });
    });

    setMicroAreas([...microAreasColorized]);
    // console.log('colorizedAreas', colorizedAreas);
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
      fillOpacity: 0.5, strokeColor: '#fff',
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

  const handleCloseModal = () => {
    setIsShowModal(false);
  };
  const handleOpenModal = () => {
    setIsShowModal(true);
  };

  return (
    <div style={{ position: 'relative', overflow: 'hidden' }}>
      <MapStyled
        className='map'
        mapTypeControl={false}
        google={google}
        initialCenter={centerMapCoordinates}
        zoom={11}
        scaleControl={false}
        fullscreenControl={false}
      >
        {ubs.length > 0 && renderMarkers()}

        {microAreas.length > 0 && renderPolygon()}

        <GeneralInfoWindow handleShowMore={handleOpenModal} map={map} google={google} mapCenter={mapCenter} ubs={activeFeature.ubs} mca={activeFeature.mca} feature={activeFeature.feature} isShowInfoWindow={isShowInfoWindow} />

      </MapStyled>
      <Modal isOpen={isShowModal} data={activeFeature} handleCloseModal={handleCloseModal} />
    </div>
  );
};

const Mapa = GoogleApiWrapper({
  apiKey: process.env.REACT_APP_MAP_KEY,
  language: 'pt-BR',
})(MapContainer);

export default Mapa;
