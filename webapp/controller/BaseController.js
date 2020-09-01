sap.ui.define([
	"sap/ui/core/mvc/Controller",
	'sap/ui/model/json/JSONModel',
	'sap/m/MessageToast',
	"sap/m/MessageBox",
	'sap/ui/core/BusyIndicator'
], function(Controller, JSONModel, MessageToast, MessageBox, BusyIndicator) {
	"use strict";

	return Controller.extend("smud.pm.ZPM_RPDS_INVESTIGATIONS.controller.BaseController", {
		/**
		 * Convenience method for accessing the router.
		 * @public
		 * @returns {sap.ui.core.routing.Router} the router for this component
		 */
		getRouter: function() {
			return sap.ui.core.UIComponent.getRouterFor(this);
		},

		/**
		 * Convenience method for getting the view model by name.
		 * @public
		 * @param {string} [sName] the model name
		 * @returns {sap.ui.model.Model} the model instance
		 */
		getModel: function(sName) {
			return this.getView().getModel(sName);
		},

		/**
		 * Convenience method for setting the view model.
		 * @public
		 * @param {sap.ui.model.Model} oModel the model instance
		 * @param {string} sName the model name
		 * @returns {sap.ui.mvc.View} the view instance
		 */
		setModel: function(oModel, sName) {
			return this.getView().setModel(oModel, sName);
		},

		//Add this to access odata model
		oDataModel: function() {
			return this.getOwnerComponent().getModel();
		},

		/**
		 * Getter for the resource bundle.
		 * @public
		 * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
		 */
		getResourceBundle: function() {
			return this.getOwnerComponent().getModel("i18n").getResourceBundle();
		},

		/**
		 * Event handler when the share by E-Mail button has been clicked
		 * @public
		 */
		onShareEmailPress: function() {
			var oViewModel = (this.getModel("objectView") || this.getModel("worklistView"));
			sap.m.URLHelper.triggerEmail(
				null,
				oViewModel.getProperty("/shareSendEmailSubject"),
				oViewModel.getProperty("/shareSendEmailMessage")
			);
		},
		// Create New Partner Logic
		newPartner: function() {

			var oView = this.getView();
			var oDialog = oView.byId("openDialog");
			// create dialog lazily
			if (!oDialog) {
				// create dialog via fragment factory
				oDialog = sap.ui.xmlfragment(oView.getId(), "smud.pm.ZPM_RPDS_INVESTIGATIONS.fragments.newPartner", this);
				oView.addDependent(oDialog);
			}
			oDialog.open();

		},
		closePartner: function() {
			this.getView().byId("openDialog").close();
			this.getView().byId("openDialog").destroy();
		},

		createPartner: function(oEvent) {

			////set Model for create Partner
			var oModel = this.oDataModel("create");
			sap.ui.getCore().setModel(oModel, "myModel");

			var myModel = sap.ui.getCore().getModel("myModel");
			var obj = {};
			var that = this;
			// obj.Notifid = this.getView().byId("notifid").getValue();
			obj.Notifid = this.getView().byId('createForm').getTitle();
			obj.Partnerrole = this.byId("ptype").getSelectedKey();
			obj.Partner = this.byId('partner').getValue();
			BusyIndicator.show();

			myModel.create('/InvPartnersSet', obj, {
				success: function(oData, oResponse) {
					//	BusyIndicator.hide();
					console.log('Record Created Successfully...');
					sap.m.MessageToast.show("New Partner Created: " + oResponse.data.Partner);
					//	MessageBox.success("Notification Created: " + oResponse.data.Notifid);
					BusyIndicator.hide();
					//					that.getView().byId("openDialog").close();
					that.getView().byId("openDialog").destroy();

				},
				error: function(err, oResponse) {
					//	debugger;
					BusyIndicator.hide();
					console.log("Error while creating record - ");
					//					sap.m.MessageToast.show("Error Creating Record: " + err.responseText.split('message')[2]);
					sap.m.MessageToast.show("Error Creating Record: " + err.responseText.split('message')[2]);
					MessageBox.error("Erro Updating Record: " + err.responseText.split('message')[2]);
					that.getView().byId("openDialog").destroy();

				}
			});

		},
		// Create New Activity Logic
		newActivity: function() {
			var oView = this.getView();
			var oDialog = oView.byId("openDialog");
			// create dialog lazily
			if (!oDialog) {
				// create dialog via fragment factory
				oDialog = sap.ui.xmlfragment(oView.getId(), "smud.pm.ZPM_RPDS_INVESTIGATIONS.fragments.newActivity", this);
				oView.addDependent(oDialog);
			}
			oDialog.open();

		},
		closeActivity: function() {
			this.getView().byId("openDialog").close();
			this.getView().byId("openDialog").destroy();
		},

		createActivity: function(oEvent) {

			////set Model for create Activity
			var oModel = this.oDataModel("activity");
			sap.ui.getCore().setModel(oModel, "myModel");
			var myModel = sap.ui.getCore().getModel("myModel");
			var obj = {};
			var that = this;
			// obj.Notifid = this.getView().byId("notifid").getValue();
			var oCode = this.byId("atype")._getSelectedItemText();
			oCode = oCode.slice(0, 5);
			obj.Notifid = this.getView().byId('createForm').getTitle();
			obj.Activitygrp = oCode;
			obj.Activitycode = this.byId("atype").getSelectedKey();
			obj.Activitytxt = this.byId('amount').getValue();
			obj.Activitystrdate = this.byId('date').getValue() + "T00:00:00";
			//obj.Activitystrdate  = this.byId('date').getValue();
			BusyIndicator.show();

			myModel.create('/InvActivitiesSet', obj, {
				success: function(oData, oResponse) {
					//	BusyIndicator.hide();
					console.log('Record Created Successfully...');
					sap.m.MessageToast.show("New Activity Created: " + oResponse.data.activitycode);
					//	MessageBox.success("Notification Created: " + oResponse.data.Notifid);
					BusyIndicator.hide();
					//that.getView().byId("openDialog").close();
					that.getView().byId("openDialog").destroy();
				},
				error: function(err, oResponse) {
					//	debugger;
					BusyIndicator.hide();
					console.log("Error while creating record - ");
					//					sap.m.MessageToast.show("Error Creating Record: " + err.responseText.split('message')[2]);
					sap.m.MessageToast.show("Error Creating Record: " + err.responseText.split('message')[2]);
					MessageBox.error("Erro Updating Record: " + err.responseText.split('message')[2]);
					that.getView().byId("openDialog").destroy();

				}
			});

		},
		newTask: function() {
			var oView = this.getView();
			var oDialog = oView.byId("openDialog");
			// create dialog lazily
			if (!oDialog) {
				// create dialog via fragment factory
				oDialog = sap.ui.xmlfragment(oView.getId(), "smud.pm.ZPM_RPDS_INVESTIGATIONS.fragments.newTask", this);
				oView.addDependent(oDialog);
			}
			oDialog.open();

		},

		createTask: function(oEvent) {
			debugger;
			////set Model to create Task
			var oModel = this.oDataModel("openDialog");
			sap.ui.getCore().setModel(oModel, "myModel");
			var myModel = sap.ui.getCore().getModel("myModel");
			var obj = {};
			var that = this;
			//Fill data to create Task
			obj.Notifid = this.getView().byId('createForm').getTitle();
			obj.Taskgrp = 'RP010';
			obj.Taskcode = this.byId('tcode').getValue();
			obj.Taskshrtxt = this.byId('text').getValue();
			obj.Taskperson = this.byId('tperson').getValue();
			BusyIndicator.show();

			//Call backedn Odata Create
			myModel.create('/InvTasksSet', obj, {
				success: function(oData, oResponse) {
					//	BusyIndicator.hide();
					console.log('Record Created Successfully...');
					sap.m.MessageToast.show("New Task Created: " + oResponse.data.Taskcode);
					//	MessageBox.success("Notification Created: " + oResponse.data.Notifid);
					BusyIndicator.hide();
					//that.getView().byId("openDialog").close();
					that.getView().byId("openDialog").destroy();
				},
				error: function(err, oResponse) {
					//	debugger;
					BusyIndicator.hide();
					console.log("Error while creating record - ");
					//					sap.m.MessageToast.show("Error Creating Record: " + err.responseText.split('message')[2]);
					sap.m.MessageToast.show("Error Creating Record: " + err.responseText.split('message')[2]);
					MessageBox.error("Erro Updating Record: " + err.responseText.split('message')[2]);
					that.getView().byId("opendialog").destroy();

				}
			});

		},

		editTaskNotes: function(oEvent) {
			var oView = this.getView();
			var oDialog = oView.byId("openDialog");
			//get row data
			var rowData = oEvent.getSource().getBindingContext().getObject();
			// create dialog lazily
			if (!oDialog) {
				// create dialog via fragment factory
				oDialog = sap.ui.xmlfragment(oView.getId(), "smud.pm.ZPM_RPDS_INVESTIGATIONS.fragments.editTaskNotes", this);
				oView.addDependent(oDialog);
			}
			oDialog.open();
			debugger;
			this.byId('tnote').setValue(rowData.Tasklongtxt);
			this.byId('tnum').setText(rowData.Tasknumber);

		},

		createTaskNote: function(oEvent) {
			////set Model to create Task
			var oModel = this.oDataModel("openDialog");
			sap.ui.getCore().setModel(oModel, "myModel");
			var myModel = sap.ui.getCore().getModel("myModel");
			var obj = {};
			var that = this;
			debugger;
			//Fill Data to create new Task Note
			//var rowData = oEvent.getSource().getBindingContext().getObject();
			var oTaskNumber = this.byId('tnum').getText();
			obj.Notifid = oEvent.getSource().getParent().getBindingContext().getObject().Notifid;
			obj.Tasklongtxt = this.getView().byId('nnote').getValue();
			obj.Tasknumber = this.getView().byId('tnum').getText();

			//	var uPath = oEvent.getSource().getBindingContext().getPath();
			var oPath = '/InvTasksSet(Notifid=' + "'" + obj.Notifid + "'" + ',Tasknumber=' + "'" + oTaskNumber + "'" + ')';
			BusyIndicator.show();
			myModel.update(oPath, obj, {
				merge: false,
				success: function(oData, oResponse) {
					BusyIndicator.hide();
					console.log('Record updated Successfully...');
					that.getView().byId("openDialog").destroy();
				},
				error: function(err, oResponse) {
					//	debugger;
					BusyIndicator.hide();
					sap.m.MessageToast.show("Erro Updating Record: " + err.responseText.split('message')[2]);
					MessageBox.error("Erro Updating Record: " + err.responseText.split('message')[2]);
					console.log("Error while creating record - ");
					that.getView().byId("openDialog").destroy();
				}

			});

		},

		//Header Note Create Popup
		newNote: function() {
			debugger;
			var oView = this.getView();
			var oDialog = oView.byId("openDialog");
			// create dialog lazily
			if (!oDialog) {
				// create dialog via fragment factory
				oDialog = sap.ui.xmlfragment(oView.getId(), "smud.pm.ZPM_RPDS_INVESTIGATIONS.fragments.newHeaderNote", this);
				oView.addDependent(oDialog);
			}
			oDialog.open();

		},
		createNote: function(oEvent) {

			////set Model to create Task
			var oModel = this.oDataModel("openDialog");
			sap.ui.getCore().setModel(oModel, "myModel");
			var myModel = sap.ui.getCore().getModel("myModel");
			var obj = {};
			var that = this;
			debugger;
			//Fill data to create Task
			obj.Notifid = this.getView().byId('noteForm').getTitle();
			obj.Notiflongtxt = this.getView().byId('hnote').getValue()

			BusyIndicator.show();

			//Call backend Odata Create New header Note

			var uPath = '/InvHeaderSet' + "('" + obj.Notifid + "')";
			myModel.update(uPath, obj, {
				merge: false,
				success: function(oData, oResponse) {
					//	BusyIndicator.hide();
					debugger;
					BusyIndicator.hide();
					that.getView().byId("openDialog").destroy();
					console.log('Record Created Successfully...');
					sap.m.MessageToast.show("Note Updated ");
					//	MessageBox.success("Notification Created: " + oResponse.data.Notifid);

				},
				error: function(err, oResponse) {
					debugger;
					BusyIndicator.hide();
					that.getView().byId("opendialog").destroy();
					console.log("Error while creating record - ");
					MessageBox.error("Error Updating Record: " + err.responseText.split('message')[2]);

				}
			});

		},

		onPressDetails: function() {
			var oView = this.getView();
			var oDialog = oView.byId("openDialog");
			// create dialog lazily
			if (!oDialog) {
				// create dialog via fragment factory
				oDialog = sap.ui.xmlfragment(oView.getId(), "smud.pm.ZPM_RPDS_INVESTIGATIONS.fragments.editDetails", this);
				oView.addDependent(oDialog);
			}
			oDialog.open();
			//this.byId('cacode').setValue(this.byId('Cacode').getText());
			this.byId('cacode').setSelectedKey(this.byId('Cacode').getText());
			//	this.byId('cocode').setValue(this.byId('Cocode').getText());
			this.byId('cocode').setSelectedKey(this.byId('Cocode').getText());
			this.byId('catxt').setValue(this.byId('Catxt').getText());
			//this.byId('icode').setValue(this.byId('Icode').getText());
			this.byId('icode').setSelectedKey(this.byId('Icode').getText());
			this.byId('dagrp').setValue(this.byId('Dagrp').getText());
			this.byId('dacode').setValue(this.byId('Dacode').getText());
			this.byId('growh').setValue(this.byId('Growh').getText());
			this.byId('rtype').setValue(this.byId('Rtype').getText());
			this.byId('mbill').setValue(this.byId('Mbill').getText());
			this.byId('mkwh').setValue(this.byId('Mkwh').getText());

		},

		editDetails: function(oEvent) {
			////set Model to edit Task
			var oModel = this.oDataModel("activity");
			sap.ui.getCore().setModel(oModel, "myModel");
			var myModel = sap.ui.getCore().getModel("myModel");
			var obj = {};
			var that = this;
			// Fill data
			obj.Notifid = oEvent.getSource().getBindingContext().getObject().Notifid;
			obj.Causenum = oEvent.getSource().getBindingContext().getObject().Causenum;
			obj.Itemnum = oEvent.getSource().getBindingContext().getObject().Itemnum;
			obj.Codinggrp = "RPDS";
			//obj.Codingcode = this.byId('cocode').getValue();
			obj.Codingcode = this.byId('cocode').getSelectedKey();
			obj.Causegrp = "RPRESULT";
			//obj.Causecode = this.byId('cacode').getValue();
			obj.Causecode = this.byId('cacode').getSelectedKey();
			obj.Causeshtxt = this.byId('catxt').getValue();
			obj.Itobjpartgrp = "RP010";
			//obj.Itobjpartcode = this.byId('icode').getValue();
			obj.Itobjpartcode = this.byId('icode').getSelectedKey();
			obj.Itdamagegrp = this.byId('dagrp').getValue();
			obj.Itdamagecode = this.byId('dacode').getValue();
			obj.Itgrowhouse = this.byId('growh').getValue();
			obj.Itratetype = this.byId('rtype').getValue();
			obj.Itfwdbill = this.byId('mbill').getValue();
			obj.Itfwdkwh = this.byId('mkwh').getValue();

			var uPath = "/InvHeaderSet('" + oEvent.getSource().getBindingContext().getObject().Notifid + "')";
			debugger;
			myModel.update(uPath, obj, {
				merge: false,
				success: function(oData, oResponse) {
					debugger;
					BusyIndicator.hide();
					console.log('Record updated Successfully...');
					that.getView().byId("openDialog").destroy();
				},
				error: function(err, oResponse) {
					debugger;
					BusyIndicator.hide();
					sap.m.MessageToast.show("Erro Updating Record: " + err.responseText.split('message')[2]);
					MessageBox.error("Erro Updating Record: " + err.responseText.split('message')[2]);
					console.log("Error while creating record - ");
					that.getView().byId("openDialog").destroy();
				}

			});
		},

		onPressTask: function(oEvent) {
			var oView = this.getView();
			var oDialog = oView.byId("openDialog");
			//get row data
			var rowData = oEvent.getSource().getBindingContext().getObject();
			// create dialog lazily
			if (!oDialog) {
				// create dialog via fragment factory
				oDialog = sap.ui.xmlfragment(oView.getId(), "smud.pm.ZPM_RPDS_INVESTIGATIONS.fragments.editTask", this);
				oView.addDependent(oDialog);
			}
			oDialog.open();
			debugger;
			this.byId('editTask').setTitle(rowData.Taskcodetxt);
			this.byId('taskno').setText(rowData.Tasknumber);
			this.byId('text').setValue(rowData.Taskshrtxt);
			this.byId('tperson').setValue(rowData.Taskperson);
			if (rowData.Userstatus) {
				this.byId('ustat').setSelected(true);
			} else {
				this.byId('ustat').setSelected(false);
			}
		},
		editTask: function(oEvent) {
			////set Model to edit Task
			var oModel = this.oDataModel("activity");
			sap.ui.getCore().setModel(oModel, "myModel");
			var myModel = sap.ui.getCore().getModel("myModel");
			var obj = {};
			var that = this;
			// Fill data
			debugger;
			var rowData = oEvent.getSource().getBindingContext().getObject();
			obj.Notifid = rowData.Notifid;
			obj.Taskshrtxt = this.byId('text').getValue();
			obj.Taskperson = this.byId('tperson').getValue();
			obj.Tasknumber = this.byId('taskno').getText();
			if (this.byId('ustat').getSelected() === true) {
				obj.Userstatus = 'PEER';
			}

			//	var uPath = oEvent.getSource().getBindingContext().getPath();
			var oPath = '/InvTasksSet(Notifid=' + "'" + rowData.Notifid + "'" + ',Tasknumber=' + "'" + obj.Tasknumber + "'" + ')';
			BusyIndicator.show();
			myModel.update(oPath, obj, {
				merge: false,
				success: function(oData, oResponse) {
					BusyIndicator.hide();
					console.log('Record updated Successfully...');
					that.getView().byId("openDialog").destroy();
				},
				error: function(err, oResponse) {
					//	debugger;
					BusyIndicator.hide();
					sap.m.MessageToast.show("Erro Updating Record: " + err.responseText.split('message')[2]);
					MessageBox.error("Erro Updating Record: " + err.responseText.split('message')[2]);
					console.log("Error while creating record - ");
					that.getView().byId("openDialog").destroy();
				}

			});

		},

		dialogAfterclose: function(oEvent) {
			debugger;
			this.getView().byId("openDialog").destroy();

		},

		dialogClear: function() {
			this.byId('amount').setValue('');
			this.byId('date').setValue('');
		},

		/**
		 * Adds a history entry in the FLP page history
		 * @public
		 * @param {object} oEntry An entry object to add to the hierachy array as expected from the ShellUIService.setHierarchy method
		 * @param {boolean} bReset If true resets the history before the new entry is added
		 */
		addHistoryEntry: (function() {
			var aHistoryEntries = [];

			return function(oEntry, bReset) {
				if (bReset) {
					aHistoryEntries = [];
				}

				var bInHistory = aHistoryEntries.some(function(entry) {
					return entry.intent === oEntry.intent;
				});

				if (!bInHistory) {
					aHistoryEntries.push(oEntry);
					this.getOwnerComponent().getService("ShellUIService").then(function(oService) {
						oService.setHierarchy(aHistoryEntries);
					});
				}
			};
		})()
	});

});