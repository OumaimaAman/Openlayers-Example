import React, { useState, useEffect } from 'react';

import { Map as Olmap, View, Feature } from 'ol';
import ImageLayer from 'ol/layer/Image';
import Static from 'ol/source/ImageStatic';
import Projection from 'ol/proj/Projection';
import { getCenter, Extent } from 'ol/extent';
import Circle from 'ol/geom/Circle';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import Style from 'ol/style/Style';
import Stroke from 'ol/style/Stroke';
import Fill from 'ol/style/Fill';
import { Select } from 'ol/interaction';
import { OverviewMap } from 'ol/control';

import 'ol/ol.css';

const Map: React.FC = () => {
  const [mapdiv, setMapdiv] = useState<HTMLDivElement | null>();

  var extent = [0, 0, 1024, 968] as Extent;
  var projection = new Projection({
    code: 'xkcd-image',
    units: 'pixels',
    extent: extent,
  });

  const myLayer = new ImageLayer({
    source: new Static({
      attributions: '© <a href="http://xkcd.com/license.html">xkcd</a>',
      url: 'https://imgs.xkcd.com/comics/online_communities.png',
      projection: projection,
      imageExtent: extent,
    }),
  });

  const myView = new View({
    projection: projection,
    center: getCenter(extent),
    zoom: 1,
    maxZoom: 8,
  });

  const circle = new Circle([500, 500], 100);
  const featureCircle = new Feature({
    geometry: circle,
  });

  const myVectorSource = new VectorSource({
    features: [featureCircle],
  });
  const myVectorLayer = new VectorLayer({ source: myVectorSource });
  const myLayers = [myLayer, myVectorLayer];

  // Create map
  const [olmap] = useState(
    new Olmap({
      layers: myLayers,
      target: 'map',
      view: myView,
    })
  );

  useEffect(() => {
    mapdiv && olmap.setTarget(mapdiv);
  }, [mapdiv, olmap]);

  const style = new Style({
    fill: new Fill({
      color: 'rgba(255, 0, 0, 1)',
    }),
    stroke: new Stroke({
      color: [255, 204, 51, 1],
      width: 4,
    }),
  });

  const select = new Select();
  olmap.addInteraction(select);

  select.on('select', (e) => {
    e.selected.forEach((el) => el.setStyle(style));
  });

  olmap.addControl(new OverviewMap({ layers: [myLayer] }));

  return (
    <div>
      <div
        ref={(el): void => {
          setMapdiv(el);
        }}
        style={{
          width: '100%',
          height: '800px',
        }}
      ></div>
    </div>
  );
};

export default Map;
