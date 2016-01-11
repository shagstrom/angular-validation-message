angular.module('angular-validation-message-example', [ 'shagstrom.angular-validation-message' ])

	.config(function($translateProvider, validationMessagesSettingsProvider) {
		$translateProvider.preferredLanguage('en');
		$translateProvider.useSanitizeValueStrategy(null);
		validationMessagesSettingsProvider.setTooltipType('tooltipster');
	});