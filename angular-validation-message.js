angular.module('shagstrom.angular-validation-message', ['pascalprecht.translate'])

	.provider('validationMessagesSettings', function() {

		// Default template
		var messagesTemplate = '<span ng-if="showMessage" ng-repeat="message in messages" class="validation-message">{{message}}</span>';
		var tooltipType = 'title';

		this.setMessagesTemplate = function(theMessagesTemplate) {
			messagesTemplate = theMessagesTemplate;
		};

		this.setTooltipType = function(theTooltipType) {
			tooltipType = theTooltipType;
		};

		this.$get = [ '$injector', function($injector) {
			return {
				messagesTemplate: messagesTemplate,
				tooltipService: function() {
					var serviceName = 'validation' + tooltipType.substr(0, 1).toUpperCase() + tooltipType.substr(1) + 'Service';
					return $injector.get(serviceName);
				}
			};
		}];

	})

	.factory('validationMessageService', [ '$translate', function($translate) {

		function translate(text) {
			var translation = $translate.instant(text);
			return translation === text ? '' : translation;
		}

		function getMessage(formName, fieldName, errorType) {
			var parts = ['VALIDATION_MESSAGE'];
			if (formName) {
				parts.push(formName);
			}
			if (fieldName) {
				parts.push(fieldName);
			}
			parts.push(errorType);
			while (parts.length > 1) {
				var message = translate(parts.join('_'));
				if (message) {
					return message;
				}
				parts.splice(1,1);
			}
			return errorType;
		}

		function getMessages(formName, fieldName, $error) {
			var messages = [];
			angular.forEach($error, function(invalid, errorType) {
				if (invalid) {
					messages.push(getMessage(formName, fieldName, errorType));
				}
			});
			return messages;
		}

		return {
			getMessages: getMessages
		};

	}])

	/**
		Default factory for creating tooltip
	*/
	.factory('validationTitleService', function() {

		function create(element, message) {
			element.attr('title', message);
		}

		function destroy(element) {
			element.attr('title', message);
		}

		return {
			create: create,
			destroy: destroy
		};

	})

	/**
		Factory for creating tooltip with tooltipster
	*/
	.factory('validationTooltipsterService', function() {

		var DEFAULT_OPTIONS = { position: 'right', theme: 'validation-tooltip', trigger: 'none' };

		function create(element, message, validationOptions) {
			if (!element.tooltipster) {
				throw "You need to load jquery.tooltipster.js";
			}
			var options = angular.extend(angular.copy(DEFAULT_OPTIONS), validationOptions, { content: message });
			element.tooltipster(options);
			element.tooltipster('show');
		}

		function destroy(element) {
			element.tooltipster('destroy');
		}

		return {
			create: create,
			destroy: destroy
		};

	})

	.factory('validationTooltipService', [ 'validationMessagesSettings', function(validationMessagesSettings) {

		var tooltipService = validationMessagesSettings.tooltipService();

		function create(element, message, validationOptions) {
			tooltipService.create(element, message, validationOptions);
			element.addClass('has-validation-tooltip');
		}

		function destroy(element) {
			if (element.hasClass('has-validation-tooltip')) {
				tooltipService.destroy(element);
				element.removeClass('has-validation-tooltip');
			}
		}

		return {
			create: create,
			destroy: destroy
		};

	}])

	.directive('validationTooltip', [ 'validationMessageService', 'validationTooltipService', function (validationMessageService, validationTooltipService) {

		return {
			restrict: 'A',
			replace: false,
			require: [ '^form', 'ngModel' ],
			scope: {
				validationOptions: '='
			},
			link: function (scope, element, attr, ctrls) {

				var formCtrl = ctrls[0], ngModelCtrl = ctrls[1];

				var updateErrorMessage = function () {
					var showMessage = false;
					if (scope.validationOptions.showBeforeSubmit) {
						showMessage = ngModelCtrl.$dirty;
					}
					if (formCtrl.$submitted) {
						showMessage = true;
					}

					if (showMessage) {
						var message = validationMessageService.getMessages(formCtrl.$name, ngModelCtrl.$name, ngModelCtrl.$error).join('\n');
						if (message) {
							validationTooltipService.create(element, message, scope.validationOptions);
						} else {
							validationTooltipService.destroy(element);
						}
					} else {
						validationTooltipService.destroy(element);
					}
				};

				scope.$watch(function() { return formCtrl.$submitted || ngModelCtrl.$error; }, updateErrorMessage, true);
				if (scope.validationOptions.showBeforeSubmit) {
					scope.$watch(function() { return ngModelCtrl.$dirty; }, updateErrorMessage, true);
				}

				scope.$on('$destroy', function () {
					validationTooltipService.destroy(element);
				});

			}
		};

	}])

	.directive('validationMessages', [ 'validationMessageService', 'validationMessagesSettings', function (validationMessageService, validationMessagesSettings) {

		return {
			restrict: 'EA',
			replace: false,
			require: '^form',
			scope: {
				fieldName: '@validationMessages',
				validationOptions: '=?'
			},
			template: validationMessagesSettings.messagesTemplate,
			link: function (scope, element, attr, formCtrl) {
				var ngModelCtrl = formCtrl[scope.fieldName];
				scope.validationOptions = scope.validationOptions || {};

				var updateErrorMessage = function () {
					scope.showMessage = false;
					if (scope.validationOptions.showBeforeSubmit) {
						scope.showMessage = ngModelCtrl.$dirty;
					}
					if (formCtrl.$submitted) {
						scope.showMessage = true;
					}
					scope.messages = validationMessageService.getMessages(formCtrl.$name, scope.fieldName, formCtrl[scope.fieldName].$error);
				};

				scope.$watch(function() { return formCtrl.$submitted || formCtrl[scope.fieldName].$error; }, updateErrorMessage, true);
				if (scope.validationOptions.showBeforeSubmit) {
					scope.$watch(function () { return ngModelCtrl.$dirty; }, updateErrorMessage, true);
				}
			}
		};

	}]);
