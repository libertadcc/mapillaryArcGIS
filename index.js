// import Map from "https://js.arcgis.com/4.19/@arcgis/core/Map.js";
// import MapView from "https://js.arcgis.com/4.19/@arcgis/core/views/MapView.js";
// import GraphicsLayer from "https://js.arcgis.com/4.19/@arcgis/core/layers/GraphicsLayer.js";
// import Graphic from "https://js.arcgis.com/4.19/@arcgis/core/Graphic.js";
// import Extent from "https://js.arcgis.com/4.19/@arcgis/core/geometry/Extent.js";
// import {webMercatorUtils} from "https://js.arcgis.com/4.19/@arcgis/core/geometry/support/webMercatorUtils.js";
// import Sketch from "https://js.arcgis.com/4.19/@arcgis/core/widgets/Sketch.js";
// import esriConfig from "https://js.arcgis.com/4.19/@arcgis/core/config.js";
require([
  "esri/Map", 
  "esri/views/MapView", 
  "esri/layers/GraphicsLayer", 
  "esri/Graphic", 
  "esri/geometry/Extent", 
  "esri/geometry/support/webMercatorUtils", 
  "esri/widgets/Sketch", 
  "esri/config"],
  function(Map, MapView, GraphicsLayer, Graphic, Extent, webMercatorUtils, Sketch, esriConfig) {
    esriConfig.apiKey = "AAPK38d0654e1eb749b7b6cfc3079bbfdf44KkQ5OBC4rat6o-i1VOw7ZF1KBDM5dz15O0LTwwLLOdzqFeLwVopKBOQQ0Z-qP4VJ";
    const graphicsLayer = new GraphicsLayer();
    
    const map = new Map({
      basemap: "gray-vector",
      layers: [graphicsLayer]
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
    button.addEventListener('click', function () {
      const value = document.getElementById('coordinates').value;
      getPhotos(value);
    });
    
    
    function getPhotos(coord) {
      console.log('coord', coord);
      var requestOptions = {
        method: 'GET',
        redirect: 'follow'
      };
    
      const elementsPerPage = 20;
      const simpleMarkerSymbol = {
        type: "simple-marker",
        style: "circle",
        outline: { color: [34, 81, 34, 0.86] },
        size: 10,
        color: [230, 217, 40, 0.92]
      };
    
    
      let simplePointer = {
        type: 'point'
      };
    
    
      fetch(`https://a.mapillary.com/v3/images?bbox=${coord}&client_id=${clientIDMapillary}&per_page=${elementsPerPage}`, requestOptions)
        .then(response => response.json())
        .then(result => {
          const coordNumbers = coord.split(',');
          // view.extent = new Extent(-644882.226,5346006.812,-521054.240,5252142.141);
          view.extent = new Extent(coordNumbers[0], coordNumbers[1], coordNumbers[2], coordNumbers[3]);
          console.log('view.extent', view.extent)
          result.features.forEach((punto) => {
            simplePointer.longitude = punto.geometry.coordinates[0];
            simplePointer.latitude = punto.geometry.coordinates[1];
    
            const simpleMarkerGraphic = new Graphic({
              geometry: simplePointer,
              symbol: simpleMarkerSymbol,
              popupTemplate: {
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
            view.graphics.add(simpleMarkerGraphic);
          });
        })
        .catch(error => console.log('error', error));
    };
    
    const sketch = new Sketch({
      layer: graphicsLayer,
      view: view,
      creationMode: "update",
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
    const coordinates = []
    
    view.when(() => {
      view.ui.add(sketch, "top-right");
    
      sketch.on("create", function(event) {
        if (event.toolEventInfo && event.toolEventInfo.type == 'vertex-add') {
          let current = event.toolEventInfo.added;
          coordinates.push(current);
        };
    
        if (event.state === "complete") {
          fetchData(coordinates)
        }
      });
    });
    
    const fetchData = (coordinates) => {
      let currentBox = `${coordinates[0]},${coordinates[1]}`;
      console.log('currentBox', currentBox);
      var geom = webMercatorUtils.webMercatorToGeographic(currentBox); // convertir  -626537.3394674773 a -3.55222 - cómo??
      console.log('geom', geom)
      //getPhotos(currentBox)
    };





  })
