/*global QUnit*/

jQuery.sap.require("sap.ui.qunit.qunit-css");
jQuery.sap.require("sap.ui.thirdparty.qunit");
jQuery.sap.require("sap.ui.qunit.qunit-junit");
QUnit.config.autostart = false;

sap.ui.require([
	"sap/ui/test/Opa5",
	"smud/pm/ZPM_RPDS_INVESTIGATIONS/test/integration/pages/Common",
	"sap/ui/test/opaQunit",
	"smud/pm/ZPM_RPDS_INVESTIGATIONS/test/integration/pages/Worklist",
	"smud/pm/ZPM_RPDS_INVESTIGATIONS/test/integration/pages/Object",
	"smud/pm/ZPM_RPDS_INVESTIGATIONS/test/integration/pages/NotFound",
	"smud/pm/ZPM_RPDS_INVESTIGATIONS/test/integration/pages/Browser",
	"smud/pm/ZPM_RPDS_INVESTIGATIONS/test/integration/pages/App"
], function (Opa5, Common) {
	"use strict";
	Opa5.extendConfig({
		arrangements: new Common(),
		viewNamespace: "smud.pm.ZPM_RPDS_INVESTIGATIONS.view."
	});

	sap.ui.require([
		"smud/pm/ZPM_RPDS_INVESTIGATIONS/test/integration/WorklistJourney",
		"smud/pm/ZPM_RPDS_INVESTIGATIONS/test/integration/ObjectJourney",
		"smud/pm/ZPM_RPDS_INVESTIGATIONS/test/integration/NavigationJourney",
		"smud/pm/ZPM_RPDS_INVESTIGATIONS/test/integration/NotFoundJourney",
		"smud/pm/ZPM_RPDS_INVESTIGATIONS/test/integration/FLPIntegrationJourney"
	], function () {
		QUnit.start();
	});
});