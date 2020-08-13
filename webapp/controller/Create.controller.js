sap.ui.define([
	"smud/pm/ZPM_RPDS_INVESTIGATIONS/controller/BaseController"
], function(BaseController) {
	"use strict";

	return BaseController.extend("smud.pm.ZPM_RPDS_INVESTIGATIONS.controller.Create", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf smud.pm.ZPM_RPDS_INVESTIGATIONS.view.Create
		 */
		onInit: function() {
			//catch the values after URL
			var oRouter = this.getRouter();
			oRouter.getRoute("create").attachMatched(this._onRouteMatched, this);

			//set Model
			var oModel = this.oDataModel("create");
			sap.ui.getCore().setModel(oModel, "myModel");
		},
		_onRouteMatched: function(oEvent) {
			var oArgs;
			var oView;
			oArgs = oEvent.getParameter("arguments");
			oView = this.getView();
			//debugger;
			var arg1 = oArgs.equip;
			var arg2 = oArgs.pri;
			var arg3 = oArgs.code;
			var arg4 = oArgs.cust;
			var arg5 = sap.ushell.Container.getService("UserInfo").getId();
			this.byId("date").setDateValue(new Date());

			this.getView().getModel("tempModel").setProperty("/", {
				"argsEquip": arg1,
				"argsPri": arg2,
				"argsCode": arg3,
				"argsCust": arg4,
				"argUser": arg5
			});
		},

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf smud.pm.ZPM_RPDS_INVESTIGATIONS.view.Create
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf smud.pm.ZPM_RPDS_INVESTIGATIONS.view.Create
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf smud.pm.ZPM_RPDS_INVESTIGATIONS.view.Create
		 */
		//	onExit: function() {
		//
		//	}

		createInv: function() {

			var myModel = sap.ui.getCore().getModel("myModel");
			var obj = {};
			obj.Notifshtxt = this.getView().byId("ntxt").getValue();
			obj.Notifreporter = this.getView().byId("rep").getValue();
			obj.Equipment = this.getView().byId("equip").getValue();
			obj.Priority = this.getView().byId("pri").getValue();
			obj.Causegrp = this.getView().byId("cagrp").getValue();
			obj.Causecode = this.getView().byId("cacode").getValue();
			obj.Codinggrp = this.getView().byId("cgrp").getValue();
			obj.Codingcode = this.getView().byId("code").getValue();

			myModel.create('/InvHeaderSet', obj, {
				success: function(oData, oResponse) {

					console.log('Record Created Successfully...');
				},
				error: function(err, oResponse) {
					//	debugger;
					console.log("Error while creating record - ");
				}
			});

		}

	});

});