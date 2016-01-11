# Angular validation message

Displaying validation messages based on ngForm validation.

Using angular-translate to resolve error message.

Tooltip and inline validation messages available. Using Tooltipster with toolitp messages (other tooltip inplementations will be supported in the future).

Example:

    <!DOCTYPE html>
    <html>
        <head>
            <meta charset="utf-8">
            <title>Example</title>

            <link rel="stylesheet" href="bower_components/tooltipster/css/tooltipster.css" />
            <link rel="stylesheet" href="bower_components/angular-validation-message/angular-validation-message.css" />
            <script src="bower_components/jquery/dist/jquery.js"></script>
            <script src="bower_components/angular/angular.js"></script>
            <script src="bower_components/angular-translate/angular-translate.js"></script>
            <script src="bower_components/tooltipster/js/jquery.tooltipster.min.js"></script>
            <script src="bower_components/angular-validation-message/angular-validation-message.js"></script>
            <script>
                angular.module('angular-validation-message-example', [ 'shagstrom.angular-validation-message' ])
                    .config(function($translateProvider, validationMessagesSettingsProvider) {
                        $translateProvider.preferredLanguage('en');
                        $translateProvider.useSanitizeValueStrategy(null);
                        validationMessagesSettingsProvider.setTooltipType('tooltipster');
                        $translateProvider.translations('en', {
                            VALIDATION_MESSAGE_required: 'Required field'
                        });
                    });
            </script>
        </head>
        <body ng-app="angular-validation-message-example">
            <h1>Angular validation message example</h1>
            <form name="exampleForm" novalidate ng-submit="false">
                <p>
                    <label>Field with tooltip validation message</label>
                    <input type="text" required name="exampleField1" ng-model="exampleField1" validation-tooltip />
                </p>
                <p>
                    <label>Field with inline validation message</label>
                    <input type="text" required name="exampleField2" ng-model="exampleField2" />
                    <span validation-messages="exampleField2"></span>
                </p>
                <p>
                    <label>Field with tooltip validation message below</label>
                    <input type="text" required name="exampleField3" ng-model="exampleField3" validation-tooltip validation-options="{position: 'bottom'}" />
                </p>
                <p>
                    <button type="submit">Go</button>
                </p>
            </form>
        </body>

    </html>