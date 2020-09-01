sap.ui.define([
	"smud/pm/ZPM_RPDS_INVESTIGATIONS/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], function(BaseController, JSONModel) {
	"use strict";

	return BaseController.extend("smud.pm.ZPM_RPDS_INVESTIGATIONS.controller.App", {

		onInit: function() {
			var oViewModel,
				fnSetAppNotBusy,
				iOriginalBusyDelay = this.getView().getBusyIndicatorDelay();

			oViewModel = new JSONModel({
				busy: true,
				delay: 0
			});
			this.setModel(oViewModel, "appView");

			// PartnerType Json Model
			var ptModel = this.getOwnerComponent().getModel("partnerType");
			this.getView().setModel(ptModel, "PTModel");

			// Activity Type Json Model
			var atModel = this.getOwnerComponent().getModel("activityType");
			this.getView().setModel(atModel, "ATModel");

			// Item Code Json Model
			var icModel = this.getOwnerComponent().getModel("itemCode");
			this.getView().setModel(icModel, "ICModel");

			// Activity Type Json Model
			var ccModel = this.getOwnerComponent().getModel("causeCode");
			this.getView().setModel(ccModel, "CCModel");
			
			// Priority Code Json Model
			var prModel = this.getOwnerComponent().getModel("priorityCode");
			this.getView().setModel(prModel, "PRModel");

			fnSetAppNotBusy = function() {
				oViewModel.setProperty("/busy", false);
				oViewModel.setProperty("/delay", iOriginalBusyDelay);
			};

			// disable busy indication when the metadata is loaded and in case of errors
			this.getOwnerComponent().getModel().metadataLoaded().
			then(fnSetAppNotBusy);
			this.getOwnerComponent().getModel().attachMetadataFailed(fnSetAppNotBusy);

			// apply content density mode to root view
			this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
		}
	});

});