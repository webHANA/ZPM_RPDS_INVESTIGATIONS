sap.ui.define([
		"smud/pm/ZPM_RPDS_INVESTIGATIONS/controller/BaseController"
	], function (BaseController) {
		"use strict";

		return BaseController.extend("smud.pm.ZPM_RPDS_INVESTIGATIONS.controller.NotFound", {

			/**
			 * Navigates to the worklist when the link is pressed
			 * @public
			 */
			onLinkPressed : function () {
				this.getRouter().navTo("worklist");
			}

		});

	}
);