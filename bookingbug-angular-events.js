(function() {
  'use strict';
  angular.module('BBAdminEvents', ['BB', 'BBAdmin.Services', 'BBAdmin.Filters', 'BBAdmin.Controllers', 'trNgGrid']);

  angular.module('BBAdminEvents').config(function($logProvider) {
    return $logProvider.debugEnabled(true);
  });

  angular.module('BBAdminEventsMockE2E', ['BBAdminEvents', 'BBAdminMockE2E']);

}).call(this);

(function() {
  angular.module('BBAdminEvents').directive('eventChainTable', function(AdminCompanyService, AdminEventChainService, $modal, $log, ModalForm, $timeout) {
    var controller, link;
    controller = function($scope) {
      var editSuccess;
      $scope.fields = ['id', 'name', 'description'];
      $scope.getEventChains = function() {
        var params;
        params = {
          company: $scope.company
        };
        return AdminEventChainService.query(params).then(function(event_chains) {
          return $scope.event_chains = event_chains;
        });
      };
      $scope.newEventChain = function() {
        return ModalForm["new"]({
          company: $scope.company,
          title: 'New Event Chain',
          new_rel: 'new_event_chain',
          post_rel: 'event_chains',
          success: function(event_chain) {
            return $scope.event_chains.push(event_chain);
          }
        });
      };
      $scope["delete"] = function(id) {
        var event_chain;
        event_chain = _.find($scope.event_chains, function(x) {
          return x.id === id;
        });
        return event_chain.$del('self').then(function() {
          return $scope.event_chains = _.reject($scope.event_chains, function(x) {
            return x.id === id;
          });
        }, function(err) {
          return $log.error("Failed to delete event_chain");
        });
      };
      editSuccess = function(updated) {
        updated.$flush('events');
        return $scope.event_chains = _.map($scope.event_chains, function(event_chain) {
          if (event_chain.id === updated.id) {
            return updated;
          } else {
            return event_chain;
          }
        });
      };
      return $scope.edit = function(id) {
        var event_chain;
        event_chain = _.find($scope.event_chains, function(x) {
          return x.id === id;
        });
        return event_chain.$get('events').then(function(collection) {
          return collection.$get('events').then(function(events) {
            event_chain.events = events;
            return ModalForm.edit({
              model: event_chain,
              title: 'Edit Event Chain',
              success: editSuccess
            });
          });
        });
      };
    };
    link = function(scope, element, attrs) {
      if (scope.company) {
        return scope.getEventChains();
      } else {
        return AdminCompanyService.query(attrs).then(function(company) {
          scope.company = company;
          return scope.getEventChains();
        });
      }
    };
    return {
      controller: controller,
      link: link,
      templateUrl: 'event_chain_table_main.html'
    };
  });

}).call(this);

(function() {
  angular.module('BBAdminEvents').directive('eventGroupTable', function(AdminCompanyService, AdminEventGroupService, $modal, $log, ModalForm) {
    var controller, link;
    controller = function($scope) {
      $scope.getEventGroups = function() {
        var params;
        params = {
          company: $scope.company
        };
        return AdminEventGroupService.query(params).then(function(event_groups) {
          $scope.event_groups_models = event_groups;
          return $scope.event_groups = _.map(event_groups, function(event_group) {
            return _.pick(event_group, 'id', 'name', 'mobile');
          });
        });
      };
      $scope.newEventGroup = function() {
        return ModalForm["new"]({
          company: $scope.company,
          title: 'New Event Group',
          new_rel: 'new_event_group',
          post_rel: 'event_groups',
          success: function(event_group) {
            return $scope.event_groups.push(event_group);
          }
        });
      };
      $scope["delete"] = function(id) {
        var event_group;
        event_group = _.find($scope.event_groups_models, function(p) {
          return p.id === id;
        });
        return event_group.$del('self').then(function() {
          return $scope.event_groups = _.reject($scope.event_groups, function(p) {
            return p.id === id;
          });
        }, function(err) {
          return $log.error("Failed to delete event_group");
        });
      };
      return $scope.edit = function(id) {
        var event_group;
        event_group = _.find($scope.event_groups_models, function(p) {
          return p.id === id;
        });
        return ModalForm.edit({
          model: event_group,
          title: 'Edit Event Group'
        });
      };
    };
    link = function(scope, element, attrs) {
      if (scope.company) {
        return scope.getEventGroups();
      } else {
        return AdminCompanyService.query(attrs).then(function(company) {
          scope.company = company;
          return scope.getEventGroups();
        });
      }
    };
    return {
      controller: controller,
      link: link,
      templateUrl: 'event_group_table_main.html'
    };
  });

}).call(this);

(function() {
  'use strict';
  var __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __hasProp = {}.hasOwnProperty;

  angular.module('BB.Models').factory("Admin.EventModel", function($q, BBModel, BaseModel) {
    var Admin_Event;
    return Admin_Event = (function(_super) {
      __extends(Admin_Event, _super);

      function Admin_Event(data) {
        Admin_Event.__super__.constructor.call(this, data);
      }

      return Admin_Event;

    })(BaseModel);
  });

}).call(this);

(function() {
  'use strict';
  var __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __hasProp = {}.hasOwnProperty;

  angular.module('BB.Models').factory("Admin.EventChainModel", function($q, BBModel, BaseModel) {
    var Admin_EventChain;
    return Admin_EventChain = (function(_super) {
      __extends(Admin_EventChain, _super);

      function Admin_EventChain(data) {
        Admin_EventChain.__super__.constructor.call(this, data);
      }

      return Admin_EventChain;

    })(BaseModel);
  });

}).call(this);

(function() {
  'use strict';
  var __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __hasProp = {}.hasOwnProperty;

  angular.module('BB.Models').factory("Admin.EventGroupModel", function($q, BBModel, BaseModel) {
    var Admin_EventGroup;
    return Admin_EventGroup = (function(_super) {
      __extends(Admin_EventGroup, _super);

      function Admin_EventGroup(data) {
        Admin_EventGroup.__super__.constructor.call(this, data);
      }

      return Admin_EventGroup;

    })(BaseModel);
  });

}).call(this);

(function() {
  angular.module('BBAdminEvents').factory('AdminEventChainService', function($q, BBModel) {
    return {
      query: function(params) {
        var company, defer;
        company = params.company;
        defer = $q.defer();
        company.$get('event_chains').then(function(collection) {
          return collection.$get('event_chains').then(function(event_chains) {
            var e, models;
            models = (function() {
              var _i, _len, _results;
              _results = [];
              for (_i = 0, _len = event_chains.length; _i < _len; _i++) {
                e = event_chains[_i];
                _results.push(new BBModel.Admin.EventChain(e));
              }
              return _results;
            })();
            return defer.resolve(models);
          }, function(err) {
            return defer.reject(err);
          });
        }, function(err) {
          return defer.reject(err);
        });
        return defer.promise;
      }
    };
  });

}).call(this);

(function() {
  angular.module('BBAdminEvents').factory('AdminEventGroupService', function($q, BBModel) {
    return {
      query: function(params) {
        var company, defer;
        company = params.company;
        defer = $q.defer();
        company.$get('event_groups').then(function(collection) {
          return collection.$get('event_groups').then(function(event_groups) {
            var e, models;
            models = (function() {
              var _i, _len, _results;
              _results = [];
              for (_i = 0, _len = event_groups.length; _i < _len; _i++) {
                e = event_groups[_i];
                _results.push(new BBModel.Admin.EventGroup(e));
              }
              return _results;
            })();
            return defer.resolve(models);
          }, function(err) {
            return defer.reject(err);
          });
        }, function(err) {
          return defer.reject(err);
        });
        return defer.promise;
      }
    };
  });

}).call(this);
