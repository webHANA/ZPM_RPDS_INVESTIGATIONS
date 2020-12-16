sap.ui.define([
	"smud/pm/ZPM_RPDS_INVESTIGATIONS/controller/BaseController",
	'sap/m/MessageToast',
	"sap/m/MessageBox",
	'sap/ui/core/BusyIndicator'
], function(BaseController, MessageToast, MessageBox, BusyIndicator) {
	"use strict";

	return BaseController.extend("smud.pm.ZPM_RPDS_INVESTIGATIONS.controller.Create", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf smud.pm.ZPM_RPDS_INVESTIGATIONS.view.Create
		 */
		onInit: function() {
			//catch the values after URL
			debugger;
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
			//	var arg4 = oArgs.cust;
			var arg5 = sap.ushell.Container.getService("UserInfo").getId();
			this.byId("date").setDateValue(new Date());

			// get customer data 
			var that = this;
			// BusyIndicator.show();
			//this.getOwnerComponent().getModel().read(`/InvEquipmentSet('${arg1}')`, {
			this.getOwnerComponent().getModel().read("/InvEquipmentSet('" + arg1 + "')", {
				success: function(oData, response) {
					that.getView().byId('ntxt').setValue(oData.Equidescr);
					that.getView().byId('equip').setDescription(oData.Equidescr);
					that.getView().byId('cust').setValue(oData.Customer);
					that.getView().byId('cdesc').setText(oData.Custname);
					that.getView().byId('cadd').setText(oData.Custaddress);
					that.getView().byId('serial').setText(oData.Serialno);
					var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
						pattern: "dd/MM/yyyy"
					});
					var aDate = oDateFormat.format(oData.Actdate);
					that.getView().byId('dnp').setText('Code: ' + oData.Actstatus + ' : ' + oData.Actstatustxt + ' on ' + aDate);
					// BusyIndicator.hide();
				},
				error: function(oError) {
					sap.m.MessageToast.show("Error Getting Equipment Information: " + oError.responseText.split('message')[2]);
					BusyIndicator.hide();
				}
			});

			this.getView().byId('pri').setSelectedKey(arg2);
			this.getView().byId('ccode').setSelectedKey(arg3);
			this.getView().getModel("tempModel").setProperty("/", {
				"argsEquip": arg1,
				"argsPri": arg2,
				"argsCode": arg3,
				//	"argsCust": arg4,
				"argUser": arg5
			});
			// add notif logic
			debugger;
			// this.getOwnerComponent().getModel.read(`/InvEquipmentSet('${arg1}')/toHeader`, {
			// 	success: function(oData, response) {
			// 		debugger;
			// 	},
			// 	error: function(oError) {
			// 		debugger;
			// 	}

			// });

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
			var that = this;
			obj.Notifshtxt = this.getView().byId("ntxt").getValue();
			obj.Codinggrp = this.getView().byId("ccgrp").getValue();
			obj.Itobjpartgrp = this.getView().byId("igrp").getValue();
			obj.Causegrp = this.getView().byId("cagrp").getValue();
			obj.Equipment = this.getView().byId("equip").getValue();
			//obj.Priority = this.getView().byId("pri").getValue();
			obj.Priority = this.getView().byId("pri").getSelectedKey();
			//obj.Codingcode = this.getView().byId("ccode").getValue();
			obj.Codingcode = this.getView().byId("ccode").getSelectedKey();
			// obj.Itobjpartcode = this.getView().byId("icode").getValue();
			obj.Itobjpartcode = this.byId('icode').getSelectedKey();
			// obj.Causecode = this.getView().byId("cacode").getValue();
			obj.Causecode = this.byId('cacode').getSelectedKey();
			obj.Notifreporter = this.getView().byId("cuser").getValue();
			//	obj.Notifdate = this.getView().byId("date").getValue();
			obj.Partnerid = this.getView().byId("cust").getValue();
			BusyIndicator.show();
			myModel.create('/InvHeaderSet', obj, {
				success: function(oData, oResponse) {
					BusyIndicator.hide();
					console.log('Record Created Successfully...');
					sap.m.MessageToast.show("Notification Created: " + oResponse.data.Notifid, {
						duration: 15000,
						animationTimingFunction: "ease-in-out"
					});
					that.getRouter().navTo("object", {
						objectId: oResponse.data.Notifid
					});

				},
				error: function(err, oResponse) {
					//	debugger;
					BusyIndicator.hide();
					console.log("Error while creating record - ");
					//					sap.m.MessageToast.show("Error Creating Record: " + err.responseText.split('message')[2]);
					sap.m.MessageToast.show("Error Creating Record: " + err.responseText.split('message')[2]);
					MessageBox.error("Erro Updating Record: " + err.responseText.split('message')[2]);

				}
			});

		},
		cancelCreate: function() {
			this.getRouter().navTo("worklist");
		},
		goBack: function() {
			this.getRouter().navTo("worklist");
		},
		refreshEqui: function() {
			// get customer data 
			var that = this;
			var equi = this.getView().byId("equip").getValue();
			BusyIndicator.show();
			//this.getOwnerComponent().getModel().read(`/InvEquipmentSet('${equi}')`, {
			this.getOwnerComponent().getModel().read("/InvEquipmentSet('" + equi + "')", {
				success: function(oData, response) {
					that.getView().byId('equip').setDescription(oData.Equidescr);
					that.getView().byId('cust').setValue(oData.Customer);
					that.getView().byId('cdesc').setText(oData.Custname);
					that.getView().byId('cadd').setText(oData.Custaddress);
					that.getView().byId('serial').setText(oData.Serialno);
					that.getView().byId('ntxt').setValue(oData.Equidescr);

					var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
						pattern: "MM/dd/yyyy"
					});
					var aDate = oDateFormat.format(oData.Actdate);
					that.getView().byId('dnp').setText('Code: ' + oData.Actstatus + ' : ' + oData.Actstatustxt + ' on ' + aDate);

					BusyIndicator.hide();
				},
				error: function(oError) {
					sap.m.MessageToast.show("Error Fetching Equipment Record: " + oError.responseText.split('message')[2]);
					BusyIndicator.hide();
				}
			});
		}

	});

});