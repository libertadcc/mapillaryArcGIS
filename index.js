import Map from "https://js.arcgis.com/4.19/@arcgis/core/Map.js";
import MapView from "https://js.arcgis.com/4.19/@arcgis/core/views/MapView.js";
import Graphic from "https://js.arcgis.com/4.19/@arcgis/core/Graphic.js";
import esriConfig from "https://js.arcgis.com/4.19/@arcgis/core/config.js";

esriConfig.apiKey = "AAPK38d0654e1eb749b7b6cfc3079bbfdf44KkQ5OBC4rat6o-i1VOw7ZF1KBDM5dz15O0LTwwLLOdzqFeLwVopKBOQQ0Z-qP4VJ";

const map = new Map({
  basemap: "gray-vector"
});

const view = new MapView({
  map: map,
  container: "viewDiv",
  extent: {
    xmin: -695101.3538393214,
    ymin: 5264104.536846918,
    xmax: -489791.4958652594,
    ymax: 5409640.63870195,
    spatialReference: {
      wkid: 102100
    }
  }
});

const clientIDMapillary = 'YzdRMmd3WHdCbW9vTmlEbVVraURzZzo3OWZiMWFmMDk1MzBiODcy'
view.on('click', (event) => {
  console.log('ev', event);
});

function addGraphic(type, point) {
  const graphic = new Graphic({
    symbol: {
      type: "simple-marker",
      color: (type === "origin") ? "white" : "black",
      size: "9px"
    },
    geometry: point
  });
  view.graphics.add(graphic);
}

const button = document.getElementById('busqueda');
button.addEventListener('click', function() {
  const value = document.getElementById('coordinates').value;
  getPhotos(value)
});


function getPhotos(coord) {
  // const prueba = view.graphics;
  // console.log(prueba.items[0].geometry.longitude);

  // const min = `${prueba.items[0].geometry.longitude},${prueba.items[0].geometry.latitude}`
  // const max = `${prueba.items[1].geometry.longitude},${prueba.items[1].geometry.latitude}`
 
  var requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  
  const bbox = coord;
  // const bbox = min+','+max;
 
  const elementsPerPage = 10;
  const simpleMarkerSymbol = {
    type: "simple-marker",
    style: "circle",
    outline: { color: [34, 81, 34, 0.86] },
    size: 10,
    color: [230, 217, 40, 0.92]
  };
  console.log('bbox', coord)

  let simplePointer = {
    type: 'point'
  };
  
  fetch(`https://a.mapillary.com/v3/images?bbox=${bbox}&client_id=${clientIDMapillary}&per_page=${elementsPerPage}`, requestOptions)
    .then(response => response.json())
    .then(result => {
      console.log('reslt', result)
      view.goTo({
        center:result.features[0].geometry.coordinates, 
        zoom: 18
      });
      result.features.forEach((punto) => {
        console.log('result', punto)

        simplePointer.longitude = punto.geometry.coordinates[0];
        simplePointer.latitude = punto.geometry.coordinates[1];
        
        const simpleMarkerGraphic = new Graphic({
          geometry: simplePointer,
          symbol: simpleMarkerSymbol,
          popupTemplate:  {
            title: 'Imagen del punto',
            content: [
              {
                type: 'media',
                mediaInfos: [{
                  value: {
                    sourceURL: `https://images.mapillary.com/${punto.properties.key}/thumb-320.jpg`
                  }
                }]
              }
            ]
          }
        });
        view.graphics.add(simpleMarkerGraphic)
      });
    })
    .catch(error => console.log('error', error));
}

//https://github.com/mapillary/mapillary-js


// https://github.com/hhkaos/mapillary-scripts/blob/main/download.js
// 'use strict'

// const parse = require('parse-link-header')
// const config = require('./config.json')
// const axios = require('axios')
// const fs = require('fs')

// const output = { type: 'FeatureCollection', features: [] }

// let pageCounter = 1

// const writeResponse = function () {
//   const outputFilename =`downloads/images_downloaded_${Date.now()}.json`
//   fs.writeFile(outputFilename, JSON.stringify(output, null, 2), err => {
//     if (err) {
//       console.error(err)
//       return
//     }
//     console.log(`Download finished: ${output.features.length} photos`)
//   })
// }

// const loadPage = function (url) {
//   axios.get(url)
//   .then(function (response) {
//     output.features = output.features.concat(response.data.features)
//     console.log(`Page ${pageCounter} received`)
//     pageCounter++


//     if (response.headers.link) {
//       const parsed = parse(response.headers.link)
//       if (parsed.next) {
//         loadPage(parsed.next.url)
//       } else {
//         writeResponse()
//       }
//     } else {
//       console.log('No link header')
//     }
//   })
//   .catch(function (error) {
//     console.log(error)
//   })
// }

// const u = new URLSearchParams({
//   client_id: config.client_id,
//   // bbox: "-2.480185,36.835700,-2.424809,36.862369",
//   bbox: '-2.487948,36.814208,-2.405207,36.87273',
//   pano: true
// }).toString()

// loadPage(`https://a.mapillary.com/v3/images?${u}`)


/*
const sketch = new Sketch({
  layer: graphicsLayer,
  view: view,
  creationMode: "update",
  snappingOptions: {  // autocasts as SnappingOptions()
    enabled: true, // snapping will be on by default
    featureSources: [{ layer: graphicsLayer }]
  },
  visibleElements: {
    createTools: {
      point: false,
      line: false,
      polyline: false,
      circle: false,
      polygon: false
    },
    selectionTools: {
      "lasso-selection": false,
      "rectangle-selection": false
    },
    settingsMenu: false,
    undoRedoMenu: false
  }
});


*/