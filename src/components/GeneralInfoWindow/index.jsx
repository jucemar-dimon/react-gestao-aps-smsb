import React from 'react';
import { InfoWindow } from 'google-maps-react';
import { getCenterFromPolygon } from '../../utils';

// import { Container } from './styles';

function GeneralInfoWindow(props) {
  const {
    data, visibility, onInfoWindowClose, teste,
  } = props;
  const { feature } = data;

  return (
    <>
      {data && data.ubs && (
        <InfoWindow
          marker={data.feature}
          visible={visibility}
          onClose={onInfoWindowClose}
        >
          <div>
            <strong>Marker</strong>

          </div>
        </InfoWindow>
      )}

      {true && (
        <InfoWindow
          position={teste}
          // position={() => getCenterFromPolygon(feature.geometry.coordinates[0])}
          visible
          onClose={onInfoWindowClose}
        >
          <div>
            <strong>Poligon</strong>
          </div>
        </InfoWindow>
      )}

    </>
  );
}

export default GeneralInfoWindow;
