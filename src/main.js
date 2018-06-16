import environment from './environment';
import {PLATFORM} from 'aurelia-pal';
import 'babel-polyfill';
import 'jquery';
import 'materialize-css';
import * as Bluebird from 'bluebird';
import './css/dd.css';
import './css/graph.css';
import './css/materialize.min.css';
import './css/common.css';
import './scripts/jspdf';
import * as saveSvgAsPngMod from './scripts/saveSvgAsPng';
import './scripts/saveSvgAsPdf';


// remove out if you don't want a Promise polyfill (remove also from webpack.config.js)
Bluebird.config({ warnings: { wForgottenReturn: false } });

export function configure(aurelia) {
  aurelia.use
    .standardConfiguration()
    .feature(PLATFORM.moduleName('resources/index'));

  //.plugin(PLATFORM.moduleName('aurelia-materialize-bridge'), b => b.useAll())
  // Uncomment the line below to enable animation.
  // aurelia.use.plugin(PLATFORM.moduleName('aurelia-animator-css'));
  // if the css animator is enabled, add swap-order="after" to all router-view elements

  // Anyone wanting to use HTMLImports to load views, will need to install the following plugin.
  // aurelia.use.plugin(PLATFORM.moduleName('aurelia-html-import-template-loader'));

  if (environment.debug) {
    aurelia.use.developmentLogging();
  }

  if (environment.testing) {
    aurelia.use.plugin(PLATFORM.moduleName('aurelia-testing'));
  }

  aurelia.start().then(() => aurelia.setRoot(PLATFORM.moduleName('app')));
}
