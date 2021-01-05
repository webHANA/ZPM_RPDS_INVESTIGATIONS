/*global location*/
sap.ui.define([
	'sap/ui/core/Fragment',
	"smud/pm/ZPM_RPDS_INVESTIGATIONS/controller/BaseController",
	"sap/ui/core/Core",
	"sap/ui/model/json/JSONModel",
	'sap/m/MessageToast',
	"sap/m/MessageBox",
	"sap/ui/core/routing/History",
	"smud/pm/ZPM_RPDS_INVESTIGATIONS/model/formatter",
	'sap/ui/core/BusyIndicator',
	"sap/ui/layout/HorizontalLayout",
	"sap/ui/layout/VerticalLayout",
	"sap/m/Dialog",
	"sap/m/DialogType",
	"sap/m/Button",
	"sap/m/ButtonType",
	"sap/m/Label",
	"sap/m/Text",
	"sap/m/TextArea",
	"sap/m/Input",
	"sap/m/DatePicker",
	"sap/ui/core/format/DateFormat",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function(
	Fragment,
	BaseController,
	Core,
	JSONModel,
	MessageToast,
	MessageBox,
	History,
	formatter,
	BusyIndicator,
	HorizontalLayout,
	VerticalLayout,
	Dialog,
	DialogType,
	Button,
	ButtonType,
	Label,
	Text,
	TextArea,
	Input,
	DatePicker,
	DateFormat,
	Filter,
	FilterOperator
) {
	"use strict";

	return BaseController.extend("smud.pm.ZPM_RPDS_INVESTIGATIONS.controller.Object", {

		formatter: formatter,

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * Called when the worklist controller is instantiated.
		 * @public
		 */
		onInit: function() {
			// Model used to manipulate control states. The chosen values make sure,
			// detail page is busy indication immediately so there is no break in
			// between the busy indication for loading the view's meta data
			var iOriginalBusyDelay,
				oViewModel = new JSONModel({
					busy: true,
					delay: 0
				});

			this.getRouter().getRoute("object").attachPatternMatched(this._onObjectMatched, this);

			// Store original busy indicator delay, so it can be restored later on
			iOriginalBusyDelay = this.getView().getBusyIndicatorDelay();
			this.setModel(oViewModel, "objectView");
			this.getOwnerComponent().getModel().metadataLoaded().then(function() {
				// Restore original busy indicator delay for the object view
				oViewModel.setProperty("/delay", iOriginalBusyDelay);
			});

			// Referesh Modzel
			debugger;
			// 	 var that = this;
			//var oView = this.getView();  
			//   oView.addEventDelegate({  
			//        onAfterShow: function(oEvent){  
			//              var oComponent = that.getOwnerComponent();
			//               var oLocalModel = oComponent.getModel("localModel");
			//               var oFlag = oLocalModel.getProperty("/oFlag");
			//                    if(oFlag){
			//                         that.getRouter().getRoute("object").attachPatternMatched(that._onObjectMatched(false), that);
			//                    oLocalModel.setProperty("/oFlag", false);
			//               }
			//        }  
			//   }, oView);
			//			sap.ui.getCore().byId("THE_ID_OF_YOUR_VIEW").getModel().refresh(true);

		},

		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */

		/**
		 * Event handler when the share in JAM button has been clicked
		 * @public
		 */
		onShareInJamPress: function() {
			var oViewModel = this.getModel("objectView"),
				oShareDialog = sap.ui.getCore().createComponent({
					name: "sap.collaboration.components.fiori.sharing.dialog",
					settings: {
						object: {
							id: location.href,
							share: oViewModel.getProperty("/shareOnJamTitle")
						}
					}
				});
			oShareDialog.open();
		},

		/* =========================================================== */
		/* internal methods                                            */
		/* =========================================================== */

		/**
		 * Binds the view to the object path.
		 * @function
		 * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
		 * @private
		 */
		_onObjectMatched: function(oEvent) {
			var sObjectId = oEvent.getParameter("arguments").objectId;
			this.getModel().metadataLoaded().then(function() {
				var sObjectPath = this.getModel().createKey("InvHeaderSet", {
					Notifid: sObjectId
				});
				this._bindView("/" + sObjectPath);
			}.bind(this));
		},

		/**
		 * Binds the view to the object path.
		 * @function
		 * @param {string} sObjectPath path to the object to be bound
		 * @private
		 */
		_bindView: function(sObjectPath) {
			var oViewModel = this.getModel("objectView"),
				oDataModel = this.getModel();

			this.getView().bindElement({
				path: sObjectPath,
				events: {
					change: this._onBindingChange.bind(this),
					dataRequested: function() {
						oDataModel.metadataLoaded().then(function() {
							// Busy indicator on view should only be set if metadata is loaded,
							// otherwise there may be two busy indications next to each other on the
							// screen. This happens because route matched handler already calls '_bindView'
							// while metadata is loaded.
							oViewModel.setProperty("/busy", true);
						});
					},
					dataReceived: function() {
						oViewModel.setProperty("/busy", false);
					}
				}
			});
		},

		_onBindingChange: function() {
			var oView = this.getView(),
				oViewModel = this.getModel("objectView"),
				oElementBinding = oView.getElementBinding();

			// No data for the binding
			if (!oElementBinding.getBoundContext()) {
				this.getRouter().getTargets().display("objectNotFound");
				return;
			}

			var oResourceBundle = this.getResourceBundle(),
				oObject = oView.getBindingContext().getObject(),
				sObjectId = oObject.Notifid,
				sObjectName = oObject.Notifshtxt;

			oViewModel.setProperty("/busy", false);
			// Add the object page to the flp routing history
			this.addHistoryEntry({
				title: this.getResourceBundle().getText("objectTitle") + " - " + sObjectName,
				icon: "sap-icon://enter-more",
				intent: "#RPDSInvestigations-display&/InvHeaderSet/" + sObjectId
					//	intent: "#RPDSInvestigations-manage&/InvHeaderSet/" + sObjectId
			});

			oViewModel.setProperty("/saveAsTileTitle", oResourceBundle.getText("saveAsTileTitle", [sObjectName]));
			oViewModel.setProperty("/shareOnJamTitle", sObjectName);
			oViewModel.setProperty("/shareSendEmailSubject",
				oResourceBundle.getText("shareSendEmailObjectSubject", [sObjectId]));
			oViewModel.setProperty("/shareSendEmailMessage",
				oResourceBundle.getText("shareSendEmailObjectMessage", [sObjectName, sObjectId, location.href]));
		},

		// taskOnRelease: function(oEvent) {
		// 	// if (oEvent.getSource().getParent().getParent().getSelectedItems().length === 0) {
		// 	// 	return MessageToast.show('Please select a Task');
		// 	// }

		// 	var itemnum = this.getView().getModel().getProperty("Tasknumber", oEvent.getSource().getBindingContext());
		// 	var notifnum = this.getView().getModel().getProperty("Notifid", oEvent.getSource().getBindingContext());
		// 	return MessageToast.show(notifnum + ' ' + itemnum);
		// 	var sPath = oEvent.getSource().getParent().getParent().getSelectedItems()[0].getBindingContext().sPath;

		// },
		updateTaskStatus: function(oEvent) {

			var oItem = oEvent.getParameter("item"),
				sItemPath = "";
			while (oItem instanceof sap.m.MenuItem) {
				sItemPath = oItem.getText() + " > " + sItemPath;
				oItem = oItem.getParent();
			}
			sItemPath = sItemPath.substr(0, sItemPath.lastIndexOf(" > "));
			var sItem = this.getView().getModel().getProperty("Tasksortno", oEvent.getSource().getBindingContext());
			var sNotifid = this.getView().getModel().getProperty("Notifid", oEvent.getSource().getBindingContext());

			// fill object for update
			var myModel = this.getOwnerComponent().getModel();
			var uPath = oEvent.getSource().getBindingContext().getPath();
			var obj = {};
			obj.Notifid = sNotifid;
			obj.Tasksortno = sItem;
			obj.Taskstatus = sItemPath;

			// Complete Task warning

			if (sItemPath === 'Complete') {

				//				if (!this.oConfirmDialog) {
				var oUser = sap.ushell.Container.getService("UserInfo").getId();
				var oDate = new Date();
				//debugger;
				var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
					pattern: "yyyy-MM-dd"
				});
				var oDate1 = oDateFormat.format(oDate);

				this.oConfirmDialog = new Dialog({
					type: DialogType.Message,
					title: "Confirm",
					content: [
						new VerticalLayout({
							content: [
								new Text({
									id: 'iText',
									text: 'You cannot make changes after completing the Task',
									fontSize: 20
								}),
								new Label({
									text: "Id: "
								}),
								new Input('notif', {
									value: sNotifid,
									enabled: false
								}),
								new Label({
									text: "Task Id: "
								}),
								new Input('tsort', {
									value: obj.Tasksortno,
									enabled: false
								}),
								new Label({
									text: "Status : "
								}),
								new Input('tstatus', {
									value: obj.Taskstatus,
									enabled: false
								}),
								new Label({
									text: "Completed By: "
								}),
								new Input('compby', {
									value: oUser
								}),
								new Label({
									text: "Completed Date : "
								}),
								new DatePicker('cdate', {
									value: oDate1,
									valueFormat: "yyyy-MM-dd",
									displayFormat: "MM/dd/yyyy"
								})
							]
						})
					],
					beginButton: new Button({
						type: ButtonType.Emphasized,
						text: "Submit",
						press: function(evt) {
							//debugger;
							var that = this;
							//Fill data for Update
							var obj1 = {};
							obj1.Notifid = Core.byId("notif").getValue();
							obj1.Tasknumber = Core.byId("tsort").getValue();
							obj1.Tasksortno = Core.byId("tsort").getValue();
							obj1.Taskstatus = Core.byId("tstatus").getValue();
							obj1.Taskcompby = Core.byId("compby").getValue();
							obj1.Taskcomdate = Core.byId("cdate").getValue() + "T00:00:00";

							//Send Update request

							myModel.update(uPath, obj1, {
								merge: false,
								success: function(oData, oResponse) {
									//debugger;
									MessageBox.success("Status Update Successful");
									this.oConfirmDialog.destroy();
								}.bind(this),
								error: function(err, oResponse) {
									//debugger;
									sap.m.MessageToast.show("Erro Updating Record: " + err.responseText.split('message')[2]);
									MessageBox.error("Erro Updating Record: " + err.responseText.split('message')[2]);
								}
							});

							this.oConfirmDialog.close();
						}.bind(this)
					}),
					endButton: new Button({
						text: "Cancel",
						press: function() {
							this.oConfirmDialog.close();
							this.oConfirmDialog.destroy();

						}.bind(this)
					})
				});
				//				}

				this.oConfirmDialog.open();
			} else {
				//Send Update request
				myModel.update(uPath, obj, {
					merge: false,
					success: function(oData, oResponse) {},
					error: function(err, oResponse) {
						sap.m.MessageToast.show("Erro Updating Record: " + err.responseText.split('message')[2]);
						MessageBox.error("Erro Updating Record: " + err.responseText.split('message')[2]);
					}
				});
			}

		},
		updateUserStatus: function(oEvent) {
			//debugger;
		},

		goBack: function() {
			this.getRouter().navTo("worklist");
		},

		// Update Notification Status on detail Page

		statusInProcess: function(oEvent) {

			var myModel = this.getOwnerComponent().getModel();
			var uPath = oEvent.getSource().getBindingContext().getPath();
			var sNotifid = this.getView().getModel().getProperty("Notifid", oEvent.getSource().getBindingContext());
			var sStatus = "InProcess";
			var obj = {};
			obj.Notifid = sNotifid;
			obj.Notifstatus = sStatus;

			myModel.update(uPath, obj, {
				merge: false,
				success: function(oData, oResponse) {

				},
				error: function(err, oResponse) {
					//	debugger;
					sap.m.MessageToast.show("Erro Updating Record: " + err.responseText.split('message')[2]);
					MessageBox.error("Erro Updating Record: " + err.responseText.split('message')[2]);
				}
			});

		},
		statusComplete: function(oEvent) {
			var myModel = this.getOwnerComponent().getModel();
			var uPath = oEvent.getSource().getBindingContext().getPath();
			var sNotifid = this.getView().getModel().getProperty("Notifid", oEvent.getSource().getBindingContext());
			var sStatus = "Complete";
			var obj = {};
			obj.Notifid = sNotifid;
			obj.Notifstatus = sStatus;
			var oUser = sap.ushell.Container.getService("UserInfo").getId();
			var oDate = new Date();
			var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
				pattern: "yyyy-MM-dd"
			});
			var oDate1 = oDateFormat.format(oDate);

			this.oNotifConfirmDialog = new Dialog({
				type: DialogType.Message,
				title: "Confirm Close Investigation",
				content: [
					new VerticalLayout({
						content: [
							new Text({
								id: 'iText',
								text: 'You cannot make changes after you close the Investigation',
								fontSize: 20
							}),
							new Label({
								text: "Investigation: "
							}),
							new Input('notif', {
								value: sNotifid,
								enabled: false
							}),
							new Label({
								text: "Status : "
							}),
							new Input('nstatus', {
								value: obj.Notifstatus,
								enabled: false
							}),
							new Label({
								text: "Completed Date : "
							}),
							new DatePicker('cdate', {
								value: oDate1,
								valueFormat: "yyyy-MM-dd",
								displayFormat: "MM/dd/yyyy"
							})
						]
					})
				],
				beginButton: new Button({
					type: ButtonType.Emphasized,
					text: "Submit",
					press: function(evt) {
						var that = this;
						//Fill data for Update
						var obj1 = {};
						obj1.Notifid = Core.byId("notif").getValue();
						obj1.Notifstatus = Core.byId("nstatus").getValue();
						obj1.Notifcompdate = Core.byId("cdate").getValue() + "T00:00:00";

						//Send Update request

						myModel.update(uPath, obj1, {
							merge: false,
							success: function(oData, oResponse) {
								MessageBox.success("Notification Completed Successful");
								this.oNotifConfirmDialog.destroy();
							}.bind(this),
							error: function(err, oResponse) {
								sap.m.MessageToast.show("Erro Updating Record: " + err.responseText.split('message')[2]);
								MessageBox.error("Erro Updating Record: " + err.responseText.split('message')[2]);
							}
						});

						this.oNotifConfirmDialog.close();
					}.bind(this)
				}),
				endButton: new Button({
					text: "Cancel",
					press: function() {
						this.oNotifConfirmDialog.close();
						this.oNotifConfirmDialog.destroy();

					}.bind(this)
				})
			});
			this.oNotifConfirmDialog.open();

		},

		damageCode: function(oEvent) {
			var getValue = oEvent.getParameters().selectedItem.mProperties.text;
			var damCode = getValue.substring(0, 5);
			this.byId('dagrp').setValue(damCode);
		},
		damagegrp: function(oEvent) {

			var getValue = oEvent.getParameters().selectedItem.mProperties.key;
			var dcFilter = [];
			if (getValue) {
				dcFilter.push(new Filter("Codegruppe", FilterOperator.Contains, getValue));
			}

			var oList = this.getView().byId("damcode");
			var oBinding = oList.getBinding("items");
			oBinding.filter(dcFilter);
			this.getView().byId("damcode").setEnabled(true);

		},
		onUpdateStart: function(oEvent) {

		},
		onListUpdateFinished: function(oEvent) {

			//read first record from activity set and populate Amount Remaining
			var fActivity = oEvent.oSource.mBindingInfos.items.binding.aKeys[0];
			if (fActivity.startsWith('InvActivitiesSet')) {
				var amtrem = this.getModel().getProperty('/' + fActivity).Activityamtrem;
				this.byId('remAmt').setText(amtrem);
			}
		}
	});
});