'use strict';
module.exports = function(app)
{
  var paymentRoutes = require('../controllers/paymentController');

  // paymentRoutes Routes
  app.route('/listPayments')
    .post(paymentRoutes.list_all_payments)
		.get(paymentRoutes.list_all_payments);

	app.route('/getCompanyPayments')
		.post(paymentRoutes.find_by_companyid)
		.get(paymentRoutes.find_by_companyid);

	app.route('/createPaymentExcel')
	   .post(paymentRoutes.create_a_payments);

  app.route('/payments/find_payment_by_ID')
	.post(paymentRoutes.find_payment_by_ID);

  app.route('/findPaymentByDelivery')
	.post(paymentRoutes.find_payment_by_delivery);

  app.route('/find_payment_by_company')
	.post(paymentRoutes.find_payment_by_company);

  app.route('/payments/:paymentsId')
    .get(paymentRoutes.read_a_payments)
    .put(paymentRoutes.update_a_payments)
    .delete(paymentRoutes.delete_a_payments);
};
