/* eslint-disable react/jsx-props-no-spreading */
import React, { useMemo } from 'react';
import { InfoWindow } from 'google-maps-react';
import { getCenterFromPolygon } from '../../utils';

// import { Container } from './styles';

function GeneralInfoWindow(props) {
  const {
    ubs, mca, feature, isShowInfoWindow, onInfoWindowClose, map, google, mapCenter,
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
  console.log('GeneralInfoWindow-props', feature);

  return (
    <InfoWindow
      {...handleConditionalProps()}
      visible={isShowInfoWindow}
      onClose={onInfoWindowClose}
      map={map}
      google={google}
      mapCenter={mapCenter}
    >
      <>
        <div>
          <h2>{feature && feature.nomeEstabelecimento}</h2>

        </div>
        <span>{feature && `CNES: ${feature.cnes}`}</span>
      </>
    </InfoWindow>
  );
}

export default GeneralInfoWindow;
