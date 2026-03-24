/**
 * CheckoutCtrl — Checkout with shipping form and Razorpay/mock payment.
 */
(function() {
  'use strict';
  angular.module('galaxyStore').controller('CheckoutCtrl', ['$scope', '$location', '$window', 'CartService', 'OrderService', 'AuthService', 'ToastService',
    function($scope, $location, $window, CartService, OrderService, AuthService, ToastService) {
      if (!AuthService.isLoggedIn()) { $location.path('/login'); return; }

      $scope.cart = { items: [] };
      $scope.loading = true;
      $scope.processing = false;
      $scope.shipping = {
        fullName: '', phone: '', street: '', city: '', state: '', zipCode: '', country: 'India'
      };
      $scope.paymentMethod = 'razorpay'; // razorpay or mock

      // Pre-fill from user profile
      var user = AuthService.getUser();
      if (user) {
        $scope.shipping.fullName = user.name || '';
        $scope.shipping.phone = user.phone || '';
      }

      CartService.getCart().then(function(res) {
        $scope.cart = res.data;
        if (!$scope.cart.items || $scope.cart.items.length === 0) {
          $location.path('/cart');
        }
        $scope.loading = false;
      });

      $scope.getItemPrice = function(item) {
        var p = item.product;
        return (p.salePrice && p.salePrice < p.price) ? p.salePrice : p.price;
      };
      $scope.getSubtotal = function() {
        var t = 0;
        if ($scope.cart.items) $scope.cart.items.forEach(function(i) { t += $scope.getItemPrice(i) * i.quantity; });
        return t;
      };
      $scope.getShipping = function() { return $scope.getSubtotal() >= 999 ? 0 : 99; };
      $scope.getTax = function() { return Math.round($scope.getSubtotal() * 0.18 * 100) / 100; };
      $scope.getTotal = function() { return $scope.getSubtotal() + $scope.getShipping() + $scope.getTax(); };

      $scope.placeOrder = function() {
        // Validate
        if (!$scope.shipping.fullName || !$scope.shipping.phone || !$scope.shipping.street ||
            !$scope.shipping.city || !$scope.shipping.state || !$scope.shipping.zipCode) {
          ToastService.warning('Please fill in all shipping details');
          return;
        }

        $scope.processing = true;

        // Create order
        OrderService.createOrder({
          shippingAddress: $scope.shipping,
          paymentMethod: $scope.paymentMethod
        }).then(function(res) {
          var order = res.data;

          if ($scope.paymentMethod === 'mock') {
            // Mock payment
            OrderService.mockPayment(order._id).then(function() {
              ToastService.success('Order placed successfully!');
              CartService.updateCartCount();
              $location.path('/order/' + order._id);
              $scope.processing = false;
            }).catch(function(err) {
              ToastService.error(err.data.message || 'Payment failed');
              $scope.processing = false;
            });
          } else {
            // Razorpay payment
            OrderService.createPaymentOrder(order._id).then(function(payRes) {
              if (payRes.data.useMock) {
                // Razorpay not configured, fall back to mock
                $scope.paymentMethod = 'mock';
                OrderService.mockPayment(order._id).then(function() {
                  ToastService.success('Order placed successfully! (Mock payment)');
                  CartService.updateCartCount();
                  $location.path('/order/' + order._id);
                  $scope.processing = false;
                });
                return;
              }

              var options = {
                key: payRes.data.keyId,
                amount: payRes.data.amount,
                currency: payRes.data.currency,
                name: '3D Galaxy Store',
                description: 'Order ' + order.orderNumber,
                order_id: payRes.data.razorpayOrderId,
                handler: function(response) {
                  // Verify payment
                  OrderService.verifyPayment({
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_signature: response.razorpay_signature,
                    orderId: order._id
                  }).then(function() {
                    $scope.$apply(function() {
                      ToastService.success('Payment successful! Order confirmed.');
                      CartService.updateCartCount();
                      $location.path('/order/' + order._id);
                      $scope.processing = false;
                    });
                  });
                },
                modal: { ondismiss: function() { $scope.$apply(function() { $scope.processing = false; }); } },
                prefill: { name: $scope.shipping.fullName, contact: $scope.shipping.phone },
                theme: { color: '#9333ea' }
              };
              var rzp = new $window.Razorpay(options);
              rzp.open();
            }).catch(function(err) {
              ToastService.error(err.data?.message || 'Payment error');
              $scope.processing = false;
            });
          }
        }).catch(function(err) {
          ToastService.error(err.data?.message || 'Order failed');
          $scope.processing = false;
        });
      };
    }
  ]);
})();
