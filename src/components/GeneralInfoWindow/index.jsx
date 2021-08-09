import React, { useMemo } from 'react';
import { InfoWindow } from 'google-maps-react';
import { getCenterFromPolygon } from '../../utils';

// import { Container } from './styles';

function GeneralInfoWindow(props) {
  const {
    ubs, mca, feature, isShowInfoWindow, onInfoWindowClose,
  } = props;

  const handleConditionalProps = () => {
    const conditionPropsObject = {};
    if (ubs) {
      conditionPropsObject.marker = feature;
    } else if (mca) {
      conditionPropsObject.position = getCenterFromPolygon(feature.geometry.coordinates[0]);
    }
  };

  return (
    <InfoWindow
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...handleConditionalProps()}
      visible={isShowInfoWindow}
      onClose={onInfoWindowClose}
    >
      <>
        <div>
          <h2>{feature && feature.properties && feature.properties.name}</h2>
          <h2>{feature && feature.nomeUbs}</h2>
        </div>
        <span>{feature && `CNES: ${feature.properties}`}</span>
      </>
    </InfoWindow>
  );
}

export default GeneralInfoWindow;
