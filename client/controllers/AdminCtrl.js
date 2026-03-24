/**
 * AdminCtrl — All admin panel controllers.
 */
(function() {
  'use strict';
  var app = angular.module('galaxyStore');

  // ========== Admin Dashboard ==========
  app.controller('AdminDashboardCtrl', ['$scope', '$location', 'AuthService', 'AdminService',
    function($scope, $location, AuthService, AdminService) {
      if (!AuthService.isAdmin()) { $location.path('/'); return; }
      $scope.stats = {};
      $scope.loading = true;
      AdminService.getDashboard().then(function(res) {
        $scope.stats = res.data;
        $scope.loading = false;
      }).catch(function() { $scope.loading = false; });

      $scope.getStatusCount = function(status) {
        if (!$scope.stats.ordersByStatus) return 0;
        var s = $scope.stats.ordersByStatus.find(function(o) { return o._id === status; });
        return s ? s.count : 0;
      };
    }
  ]);

  // ========== Admin Products ==========
  app.controller('AdminProductsCtrl', ['$scope', '$location', 'AuthService', 'AdminService', 'ProductService', 'ToastService',
    function($scope, $location, AuthService, AdminService, ProductService, ToastService) {
      if (!AuthService.isAdmin()) { $location.path('/'); return; }
      $scope.products = [];
      $scope.categories = [];
      $scope.loading = true;
      $scope.showModal = false;
      $scope.editMode = false;
      $scope.form = {};

      $scope.loadProducts = function() {
        ProductService.getProducts({ limit: 100 }).then(function(res) {
          $scope.products = res.data.products;
          $scope.loading = false;
        });
      };
      ProductService.getCategories().then(function(res) { $scope.categories = res.data; });
      $scope.loadProducts();

      $scope.openAdd = function() {
        $scope.editMode = false;
        $scope.form = { name: '', slug: '', description: '', price: '', salePrice: '', stock: 0, category: '', featured: false, images: [], isActive: true, tags: [], specifications: [] };
        $scope.newImage = '';
        $scope.newTag = '';
        $scope.showModal = true;
      };

      $scope.openEdit = function(p) {
        $scope.editMode = true;
        $scope.form = angular.copy(p);
        $scope.form.category = typeof p.category === 'object' ? p.category._id : p.category;
        $scope.newImage = '';
        $scope.newTag = '';
        $scope.showModal = true;
      };

      $scope.addImage = function() {
        if ($scope.newImage) { $scope.form.images.push($scope.newImage); $scope.newImage = ''; }
      };
      $scope.removeImage = function(i) { $scope.form.images.splice(i, 1); };
      $scope.addTag = function() {
        if ($scope.newTag) { $scope.form.tags.push($scope.newTag); $scope.newTag = ''; }
      };
      $scope.removeTag = function(i) { $scope.form.tags.splice(i, 1); };

      $scope.generateSlug = function() {
        $scope.form.slug = $scope.form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      };

      $scope.saveProduct = function() {
        var data = angular.copy($scope.form);
        if ($scope.editMode) {
          AdminService.updateProduct(data._id, data).then(function() {
            ToastService.success('Product updated');
            $scope.showModal = false;
            $scope.loadProducts();
          }).catch(function(err) { ToastService.error(err.data.message || 'Error'); });
        } else {
          AdminService.createProduct(data).then(function() {
            ToastService.success('Product created');
            $scope.showModal = false;
            $scope.loadProducts();
          }).catch(function(err) { ToastService.error(err.data.message || 'Error'); });
        }
      };

      $scope.deleteProduct = function(p) {
        if (confirm('Delete ' + p.name + '?')) {
          AdminService.deleteProduct(p._id).then(function() {
            ToastService.success('Product deleted');
            $scope.loadProducts();
          }).catch(function(err) { ToastService.error(err.data.message || 'Error'); });
        }
      };
    }
  ]);

  // ========== Admin Orders ==========
  app.controller('AdminOrdersCtrl', ['$scope', '$location', 'AuthService', 'AdminService', 'ToastService',
    function($scope, $location, AuthService, AdminService, ToastService) {
      if (!AuthService.isAdmin()) { $location.path('/'); return; }
      $scope.orders = [];
      $scope.loading = true;
      $scope.statusFilter = '';

      $scope.loadOrders = function() {
        $scope.loading = true;
        var params = {};
        if ($scope.statusFilter) params.status = $scope.statusFilter;
        AdminService.getAllOrders(params).then(function(res) {
          $scope.orders = res.data.orders;
          $scope.loading = false;
        });
      };
      $scope.loadOrders();

      $scope.updateStatus = function(order, status) {
        AdminService.updateOrderStatus(order._id, { status: status }).then(function(res) {
          order.status = res.data.status;
          ToastService.success('Order status updated to ' + status);
        }).catch(function(err) { ToastService.error(err.data.message || 'Error'); });
      };
    }
  ]);

  // ========== Admin Users ==========
  app.controller('AdminUsersCtrl', ['$scope', '$location', 'AuthService', 'AdminService', 'ToastService',
    function($scope, $location, AuthService, AdminService, ToastService) {
      if (!AuthService.isAdmin()) { $location.path('/'); return; }
      $scope.users = [];
      $scope.loading = true;
      $scope.searchQuery = '';

      $scope.loadUsers = function() {
        $scope.loading = true;
        AdminService.getUsers({ search: $scope.searchQuery }).then(function(res) {
          $scope.users = res.data.users;
          $scope.loading = false;
        });
      };
      $scope.loadUsers();

      $scope.toggleRole = function(user) {
        var newRole = user.role === 'admin' ? 'user' : 'admin';
        AdminService.updateUser(user._id, { role: newRole }).then(function(res) {
          user.role = res.data.role;
          ToastService.success('Role updated');
        });
      };

      $scope.toggleActive = function(user) {
        AdminService.updateUser(user._id, { isActive: !user.isActive }).then(function(res) {
          user.isActive = res.data.isActive;
          ToastService.success('User status updated');
        });
      };
    }
  ]);

  // ========== Admin Coupons ==========
  app.controller('AdminCouponsCtrl', ['$scope', '$location', 'AuthService', 'AdminService', 'ToastService',
    function($scope, $location, AuthService, AdminService, ToastService) {
      if (!AuthService.isAdmin()) { $location.path('/'); return; }
      $scope.coupons = [];
      $scope.loading = true;
      $scope.showModal = false;
      $scope.editMode = false;
      $scope.form = {};

      $scope.loadCoupons = function() {
        AdminService.getCoupons().then(function(res) {
          $scope.coupons = res.data;
          $scope.loading = false;
        });
      };
      $scope.loadCoupons();

      $scope.openAdd = function() {
        $scope.editMode = false;
        $scope.form = { code: '', discountType: 'percentage', discountValue: 10, minPurchase: 0, maxDiscount: 0, expiresAt: '', usageLimit: 0, isActive: true };
        $scope.showModal = true;
      };

      $scope.openEdit = function(c) {
        $scope.editMode = true;
        $scope.form = angular.copy(c);
        $scope.form.expiresAt = new Date(c.expiresAt);
        $scope.showModal = true;
      };

      $scope.saveCoupon = function() {
        if ($scope.editMode) {
          AdminService.updateCoupon($scope.form._id, $scope.form).then(function() {
            ToastService.success('Coupon updated');
            $scope.showModal = false;
            $scope.loadCoupons();
          }).catch(function(err) { ToastService.error(err.data.message || 'Error'); });
        } else {
          AdminService.createCoupon($scope.form).then(function() {
            ToastService.success('Coupon created');
            $scope.showModal = false;
            $scope.loadCoupons();
          }).catch(function(err) { ToastService.error(err.data.message || 'Error'); });
        }
      };

      $scope.deleteCoupon = function(c) {
        if (confirm('Delete coupon ' + c.code + '?')) {
          AdminService.deleteCoupon(c._id).then(function() {
            ToastService.success('Coupon deleted');
            $scope.loadCoupons();
          });
        }
      };
    }
  ]);

  // ========== Admin Categories ==========
  app.controller('AdminCategoriesCtrl', ['$scope', '$location', 'AuthService', 'AdminService', 'ProductService', 'ToastService',
    function($scope, $location, AuthService, AdminService, ProductService, ToastService) {
      if (!AuthService.isAdmin()) { $location.path('/'); return; }
      $scope.categories = [];
      $scope.loading = true;
      $scope.showModal = false;
      $scope.editMode = false;
      $scope.form = {};

      $scope.loadCategories = function() {
        ProductService.getCategories().then(function(res) {
          $scope.categories = res.data;
          $scope.loading = false;
        });
      };
      $scope.loadCategories();

      $scope.openAdd = function() {
        $scope.editMode = false;
        $scope.form = { name: '', slug: '', description: '', image: '' };
        $scope.showModal = true;
      };

      $scope.openEdit = function(c) {
        $scope.editMode = true;
        $scope.form = angular.copy(c);
        $scope.showModal = true;
      };

      $scope.generateSlug = function() {
        $scope.form.slug = $scope.form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      };

      $scope.saveCategory = function() {
        if ($scope.editMode) {
          AdminService.updateCategory($scope.form._id, $scope.form).then(function() {
            ToastService.success('Category updated');
            $scope.showModal = false;
            $scope.loadCategories();
          }).catch(function(err) { ToastService.error(err.data.message || 'Error'); });
        } else {
          AdminService.createCategory($scope.form).then(function() {
            ToastService.success('Category created');
            $scope.showModal = false;
            $scope.loadCategories();
          }).catch(function(err) { ToastService.error(err.data.message || 'Error'); });
        }
      };

      $scope.deleteCategory = function(c) {
        if (confirm('Delete category ' + c.name + '?')) {
          AdminService.deleteCategory(c._id).then(function() {
            ToastService.success('Category deleted');
            $scope.loadCategories();
          }).catch(function(err) { ToastService.error(err.data.message || 'Error'); });
        }
      };
    }
  ]);

})();
