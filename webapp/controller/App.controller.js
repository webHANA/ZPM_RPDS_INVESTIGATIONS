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

			// Damage Code Json Model
			var dcModel = this.getOwnerComponent().getModel("damageCode");
			this.getView().setModel(dcModel, "DCModel");

			// Grow House Json Model
			var ghModel = this.getOwnerComponent().getModel("growHouse");
			this.getView().setModel(ghModel, "GHModel");

			// Rate Type Json Model
			var rtModel = this.getOwnerComponent().getModel("rateType");
			this.getView().setModel(rtModel, "RTModel");

			//DamageCode Intialization
			var that = this;
			//set model for damage code
			this.getOwnerComponent().getModel().read("/InvDamageCodeShSet", {
				success: function(OData, response) {
					var uDamageGroup1 = [];
					var uDamageGroup = [];
					var dcData = OData.results;
					dcData.forEach(function(group) {
						if (!uDamageGroup1.includes(group.Codegruppe)) {
							uDamageGroup1.push(group.Codegruppe);
						}
					});
					uDamageGroup1.forEach(function(code) {
						uDamageGroup.push({
							code: code
						});
					});
					that.getView().setModel(uDamageGroup, "DaCModel");
					// uDamageGroup.forEach(function(code) {
					// 	var oSelect = that.getView().byId("damcode");
					// 	var newItem = new sap.ui.core.Item({
					// 		key: code,
					// 		text: code
					// 	});
					// 	oSelect.addItem(newItem);
					// });
				},
				error: function(oError) {
					//Error Message
				}
			});

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