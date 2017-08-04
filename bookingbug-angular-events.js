'use strict';

angular.module('BBAdminEvents', ['BB', 'BBAdmin.Services', 'BBAdmin.Filters', 'BBAdmin.Controllers', 'trNgGrid']);

angular.module('BBAdminEventsMockE2E', ['BBAdminEvents', 'BBAdminMockE2E']);
'use strict';

angular.module('BBAdminEvents').config(function ($logProvider) {
    'ngInject';

    $logProvider.debugEnabled(true);
});
'use strict';

angular.module('BBAdminEvents').directive('eventChainTable', function (BBModel, $log, ModalForm) {

    var controller = function controller($scope) {

        $scope.fields = ['id', 'name', 'description'];

        $scope.getEventChains = function () {
            var params = { company: $scope.company };
            return BBModel.Admin.EventChain.$query(params).then(function (event_chains) {
                return $scope.event_chains = event_chains;
            });
        };

        $scope.newEventChain = function () {
            return ModalForm.new({
                company: $scope.company,
                title: 'New Event Chain',
                new_rel: 'new_event_chain',
                post_rel: 'event_chains',
                success: function success(event_chain) {
                    return $scope.event_chains.push(event_chain);
                }
            });
        };

        $scope.delete = function (id) {
            var event_chain = _.find($scope.event_chains, function (x) {
                return x.id === id;
            });
            return event_chain.$del('self').then(function () {
                return $scope.event_chains = _.reject($scope.event_chains, function (x) {
                    return x.id === id;
                });
            }, function (err) {
                return $log.error("Failed to delete event_chain");
            });
        };

        var editSuccess = function editSuccess(updated) {
            updated.$flush('events');
            return $scope.event_chains = _.map($scope.event_chains, function (event_chain) {
                if (event_chain.id === updated.id) {
                    return updated;
                } else {
                    return event_chain;
                }
            });
        };

        return $scope.edit = function (id) {
            var event_chain = _.find($scope.event_chains, function (x) {
                return x.id === id;
            });
            return event_chain.$get('events').then(function (collection) {
                return collection.$get('events').then(function (events) {
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

    var link = function link(scope, element, attrs) {
        if (scope.company) {
            return scope.getEventChains();
        } else {
            return BBModel.Admin.Company.$query(attrs).then(function (company) {
                scope.company = company;
                return scope.getEventChains();
            });
        }
    };

    return {
        controller: controller,
        link: link,
        templateUrl: 'event-chain-table/event_chain_table_main.html'
    };
});
'use strict';

angular.module('BBAdminEvents').directive('eventGroupTable', function (BBModel, $log, ModalForm) {

    var controller = function controller($scope) {

        $scope.getEventGroups = function () {
            var params = { company: $scope.company };
            return BBModel.Admin.EventGroup.$query(params).then(function (event_groups) {
                $scope.event_groups_models = event_groups;
                return $scope.event_groups = _.map(event_groups, function (event_group) {
                    return _.pick(event_group, 'id', 'name', 'mobile');
                });
            });
        };

        $scope.newEventGroup = function () {
            return ModalForm.new({
                company: $scope.company,
                title: 'New Event Group',
                new_rel: 'new_event_group',
                post_rel: 'event_groups',
                success: function success(event_group) {
                    return $scope.event_groups.push(event_group);
                }
            });
        };

        $scope.delete = function (id) {
            var event_group = _.find($scope.event_groups_models, function (p) {
                return p.id === id;
            });
            return event_group.$del('self').then(function () {
                return $scope.event_groups = _.reject($scope.event_groups, function (p) {
                    return p.id === id;
                });
            }, function (err) {
                return $log.error("Failed to delete event_group");
            });
        };

        return $scope.edit = function (id) {
            var event_group = _.find($scope.event_groups_models, function (p) {
                return p.id === id;
            });
            return ModalForm.edit({
                model: event_group,
                title: 'Edit Event Group'
            });
        };
    };

    var link = function link(scope, element, attrs) {
        if (scope.company) {
            return scope.getEventGroups();
        } else {
            return BBModel.Admin.Company.$query(attrs).then(function (company) {
                scope.company = company;
                return scope.getEventGroups();
            });
        }
    };

    return {
        controller: controller,
        link: link,
        templateUrl: 'event-chain-table/event_group_table_main.html'
    };
});
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

angular.module('BB.Models').factory("AdminEventModel", function ($q, BBModel, BaseModel) {
    return function (_BaseModel) {
        _inherits(Admin_Event, _BaseModel);

        function Admin_Event(data) {
            _classCallCheck(this, Admin_Event);

            return _possibleConstructorReturn(this, _BaseModel.call(this, data));
        }

        return Admin_Event;
    }(BaseModel);
});
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

angular.module('BB.Models').factory("AdminEventChainModel", function ($q, BBModel, BaseModel, EventChainService) {
    return function (_BaseModel) {
        _inherits(Admin_EventChain, _BaseModel);

        function Admin_EventChain(data) {
            _classCallCheck(this, Admin_EventChain);

            return _possibleConstructorReturn(this, _BaseModel.call(this, data));
        }

        Admin_EventChain.$query = function $query(params) {
            return EventChainService.query(params);
        };

        return Admin_EventChain;
    }(BaseModel);
});
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

angular.module('BB.Models').factory("AdminEventGroupModel", function ($q, BBModel, BaseModel, EventGroupService) {
    return function (_BaseModel) {
        _inherits(Admin_EventGroup, _BaseModel);

        function Admin_EventGroup(data) {
            _classCallCheck(this, Admin_EventGroup);

            return _possibleConstructorReturn(this, _BaseModel.call(this, data));
        }

        Admin_EventGroup.$query = function $query(params) {
            return EventGroupService.query(params);
        };

        return Admin_EventGroup;
    }(BaseModel);
});
'use strict';

angular.module('BBAdminEvents').factory('AdminEventChainService', function ($q, BBModel) {

    return {
        query: function query(params) {
            var company = params.company;

            var defer = $q.defer();
            company.$get('event_chains').then(function (collection) {
                return collection.$get('event_chains').then(function (event_chains) {
                    var models = Array.from(event_chains).map(function (e) {
                        return new BBModel.Admin.EventChain(e);
                    });
                    return defer.resolve(models);
                }, function (err) {
                    return defer.reject(err);
                });
            }, function (err) {
                return defer.reject(err);
            });
            return defer.promise;
        }
    };
});
'use strict';

angular.module('BBAdminEvents').factory('AdminEventGroupService', function ($q, BBModel) {

    return {
        query: function query(params) {
            var company = params.company;

            var defer = $q.defer();
            company.$get('event_groups').then(function (collection) {
                return collection.$get('event_groups').then(function (event_groups) {
                    var models = Array.from(event_groups).map(function (e) {
                        return new BBModel.Admin.EventGroup(e);
                    });
                    return defer.resolve(models);
                }, function (err) {
                    return defer.reject(err);
                });
            }, function (err) {
                return defer.reject(err);
            });
            return defer.promise;
        }
    };
});
"use strict";

angular.module("BBAdminEvents").config(function ($translateProvider) {
    "ngInject";

    var translations = {
        EVENTS: {
            EVENT_CHAIN_TABLE: {
                NEW_EVENT_CHAIN_BTN: "New Event Chain",
                DELETE_BTN: "@:COMMON.BTN.DELETE",
                EDIT_BTN: "@:COMMON.BTN.EDIT"
            },
            EVENT_GROUP_TABLE: {
                NEW_EVENT_GROUP: "New Event Group",
                DELETE_BTN: "@:COMMON.BTN.DELETE",
                EDIT_BTN: "@:COMMON.BTN.EDIT"
            }
        }
    };

    $translateProvider.translations("en", translations);
});