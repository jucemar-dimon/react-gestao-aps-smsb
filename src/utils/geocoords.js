function getCenterFromPolygon(data) {
  const numCoords = data.length;
  let X = 0.0;
  let Y = 0.0;
  let Z = 0.0;

  data.forEach((element) => {
    const lat = (element.lng * Math.PI) / 180;
    const lon = (element.lat * Math.PI) / 180;
    const a = Math.cos(lat) * Math.cos(lon);
    const b = Math.cos(lat) * Math.sin(lon);
    const c = Math.sin(lat);

    X += a;
    Y += b;
    Z += c;
  });

  X /= numCoords;
  Y /= numCoords;
  Z /= numCoords;

  const lon = Math.atan2(Y, X);
  const hyp = Math.sqrt(X * X + Y * Y);
  const lat = Math.atan2(Z, hyp);

  const finalLat = (lat * 180) / Math.PI;
  const finalLng = (lon * 180) / Math.PI;

  const finalCoords = { lng: finalLat, lat: finalLng };
  return finalCoords;
}

export { getCenterFromPolygon };
