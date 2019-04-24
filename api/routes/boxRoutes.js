'use strict';
module.exports = function(app){
    var boxRoutes = require('../controllers/boxController');

    app.route('/box/announce')
      .post(boxRoutes.boxAnnounce);
    app.route('/box/cancel')
      .post(boxRoutes.boxCancel);
    app.route('/box/findparcel')
      .post(boxRoutes.boxFindParcel);
    app.route('/box/getfree')
      .post(boxRoutes.boxFreeLockers);
    app.route('/box/boxtrack')
      .post(boxRoutes.boxTrack);
    app.route('/box/update')
      .post(boxRoutes.boxUpdate);

}