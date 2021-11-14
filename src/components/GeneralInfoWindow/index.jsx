/* eslint-disable react/jsx-props-no-spreading */
import React, { useMemo } from 'react';
import { InfoWindow } from 'google-maps-react';

import { FcHome, FcRadarPlot } from 'react-icons/fc';
import { getCenterFromPolygon } from '../../utils';

import { Container } from './styles';

function GeneralInfoWindow(props) {
  const {
    ubs, mca, feature, isShowInfoWindow, onInfoWindowClose, map, google, mapCenter, handleShowMore,
  } = props;

  const handleConditionalProps = () => {
    const conditionPropsObject = {};
    if (ubs) {
      conditionPropsObject.marker = feature;
    } else if (mca) {
      conditionPropsObject.position = getCenterFromPolygon(feature.paths);
    }
    return conditionPropsObject;
  };
  // console.log('GeneralInfoWindow-props', feature);

  const showMore = () => {
    handleShowMore();
  };
  return (
    <InfoWindow
      {...handleConditionalProps()}
      visible={isShowInfoWindow}
      onClose={onInfoWindowClose}
      map={map}
      google={google}
      mapCenter={mapCenter}
    >
      <Container>

        <div className='title'>
          {ubs && <FcHome style={{ fontSize: '1rem', marginRight: 5 }} />}
          {mca && <FcRadarPlot style={{ fontSize: '1rem', marginRight: 5 }} />}
          <h2>{mca && `MICROÁREA ${feature.microarea}`}</h2>
          <h2>{ubs && feature.nomeEstabelecimento}</h2>
        </div>

        <p>{mca && `ÀREA ${feature.area} - ${feature.nomeEquipe}`}</p>
        <p>{mca && `${feature.nomeEstabelecimento}`}</p>
        {/* <button type='button' onClick={showMore()}>DETALHES</button> */}
      </Container>
    </InfoWindow>
  );
}

export default GeneralInfoWindow;
