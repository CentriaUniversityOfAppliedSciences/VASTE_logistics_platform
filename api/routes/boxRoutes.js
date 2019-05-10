'use strict';
module.exports = function(app){
    var boxRoutes = require('../controllers/boxController');


    app.route('/box/cancel')
      .post(boxRoutes.boxCancelApi);
    app.route('/box/findparcel')
      .post(boxRoutes.boxFindParcelApi);
    app.route('/box/getfree')
      .post(boxRoutes.boxFreeLockers);
    app.route('/box/boxtrack')
      .post(boxRoutes.boxTrack);
    app.route('/box/update')
      .post(boxRoutes.boxUpdateApi);

}
