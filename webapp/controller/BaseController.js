sap.ui.define([
	"sap/ui/core/mvc/Controller",
	'sap/ui/model/json/JSONModel',
	'sap/m/MessageToast',
	"sap/m/MessageBox",
	'sap/ui/core/BusyIndicator',
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/core/ValueState",
	"sap/m/Dialog",
	"sap/m/DialogType",
	"sap/m/Button",
	"sap/m/ButtonType",
	"sap/m/Text"
], function(Controller, JSONModel, MessageToast, MessageBox, BusyIndicator, Filter, FilterOperator, ValueState, Dialog, DialogType,
	Button, ButtonType, Text) {
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
			obj.Notifid = this.getView().byId('createForm').getTitle();
			obj.Partnerrole = this.byId("ptype").getSelectedKey();
			obj.Partner = this.byId('partner').getValue();
			obj.Partner = obj.Partner.toUpperCase();
			BusyIndicator.show();

			myModel.create('/InvPartnersSet', obj, {
				success: function(oData, oResponse) {
					sap.m.MessageToast.show("New Partner Created: " + oResponse.data.Partner);
					BusyIndicator.hide();
					that.getView().byId("openDialog").destroy();

				},
				error: function(err, oResponse) {
					BusyIndicator.hide();
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
			//default date to current date, date max is current date
			this.byId('date').setDateValue(new Date());
			this.byId("date").setMaxDate(new Date());
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
			var oCode = this.byId("atype")._getSelectedItemText();
			oCode = oCode.slice(0, 5);
			obj.Notifid = this.getView().byId('createForm').getTitle();
			obj.Activitygrp = oCode;
			obj.Activitycode = this.byId("atype").getSelectedKey();
			obj.Activitytxt = this.byId('amount').getValue();
			obj.Activitystrdate = this.byId('date').getValue() + "T00:00:00";

			// Validate date
			var oStrDate = this.byId('date').getValue();
			if (oStrDate === "" || obj.Activitytxt === "") {
				this.byId('date').setValueState(sap.ui.core.ValueState.Error);
				if (obj.Activitytxt === "") {
					this.byId('amount').setValueState(sap.ui.core.ValueState.Error);
				}
			} else {

				this.byId('date').setValueState(sap.ui.core.ValueState.None);
				this.byId('amount').setValueState(sap.ui.core.ValueState.None);
				BusyIndicator.show();

				myModel.create('/InvActivitiesSet', obj, {
					success: function(oData, oResponse) {
						//	BusyIndicator.hide();
						sap.m.MessageToast.show("New Activity Created: " + oResponse.data.activitycode);
						//	MessageBox.success("Notification Created: " + oResponse.data.Notifid);
						BusyIndicator.hide();
						//that.getView().byId("openDialog").close();
						that.getView().byId("openDialog").destroy();
					},
					error: function(err, oResponse) {
						//	debugger;
						BusyIndicator.hide();
						//					sap.m.MessageToast.show("Error Creating Record: " + err.responseText.split('message')[2]);
						sap.m.MessageToast.show("Error Creating Record: " + err.responseText.split('message')[2]);
						MessageBox.error("Erro Updating Record: " + err.responseText.split('message')[2]);
						that.getView().byId("openDialog").destroy();

					}
				});
			}
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
			//	debugger;
			////set Model to create Task
			var oModel = this.oDataModel("openDialog");
			sap.ui.getCore().setModel(oModel, "myModel");
			var myModel = sap.ui.getCore().getModel("myModel");
			var obj = {};
			var that = this;
			//Fill data to create Task
			obj.Notifid = this.getView().byId('createForm').getTitle();
			obj.Taskgrp = 'RP010';
			//obj.Taskcode = this.byId('tcode').getValue();
			obj.Taskcode = this.byId('tcode').getSelectedKey();
			obj.Taskshrtxt = this.byId('text').getValue();
			obj.Taskperson = this.byId('tperson').getValue();
			obj.Taskperson = obj.Taskperson.toUpperCase();
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
			//	debugger;
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
			//debugger;
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
					that.getView().byId("openDialog").destroy();
				},
				error: function(err, oResponse) {
					//	debugger;
					BusyIndicator.hide();
					sap.m.MessageToast.show("Erro Updating Record: " + err.responseText.split('message')[2]);
					MessageBox.error("Erro Updating Record: " + err.responseText.split('message')[2]);
					that.getView().byId("openDialog").destroy();
				}

			});

		},

		//Header Note Create Popup
		newNote: function() {
			//debugger;
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
			//debugger;
			//Fill data to create Task
			obj.Notifid = this.getView().byId('noteForm').getTitle();
			obj.Notiflongtxt = this.getView().byId('hnote').getValue();

			BusyIndicator.show();

			//Call backend Odata Create New header Note

			var uPath = '/InvHeaderSet' + "('" + obj.Notifid + "')";
			myModel.update(uPath, obj, {
				merge: false,
				success: function(oData, oResponse) {
					//	BusyIndicator.hide();
					//debugger;
					BusyIndicator.hide();
					that.getView().byId("openDialog").destroy();
					sap.m.MessageToast.show("Note Updated ");
					//	MessageBox.success("Notification Created: " + oResponse.data.Notifid);

				},
				error: function(err, oResponse) {
					//debugger;
					BusyIndicator.hide();
					that.getView().byId("opendialog").destroy();
					MessageBox.error("Error Updating Record: " + err.responseText.split('message')[2]);

				}
			});

		},

		onPressAdmin: function() {
			var oView = this.getView();
			var oDialog = oView.byId("openDialog");
			//Open dialog Lazily
			if (!oDialog) {
				oDialog = sap.ui.xmlfragment(oView.getId(), "smud.pm.ZPM_RPDS_INVESTIGATIONS.fragments.editAdmin", this);
				oView.addDependent(oDialog);
			}
			oDialog.open();
			//Populate data to Dialog fields
			this.byId('mbill').setValue(this.byId('Mbill').getText());
			this.byId('mkwh').setValue(this.byId('Mkwh').getText());
			this.byId('bkwh').setValue(this.byId('Bkwh').getText());
		},

		editAdmin: function(oEvent) {
			// Set Model for Admin change
			var oModel = this.oDataModel("activity");
			sap.ui.getCore().setModel(oModel, "myModel");
			var myModel = sap.ui.getCore().getModel("myModel");
			var obj = {};
			var that = this;
			//Fill data to model
			obj.Notifid = oEvent.getSource().getBindingContext().getObject().Notifid;
			obj.Causenum = oEvent.getSource().getBindingContext().getObject().Causenum;
			obj.Itemnum = oEvent.getSource().getBindingContext().getObject().Itemnum;
			// Fill Admin changes data
			obj.Itfwdbill = this.byId('mbill').getValue();
			obj.Itfwdkwh = this.byId('mkwh').getValue();
			obj.Itbckbill = this.byId('bkwh').getValue();
			//create path
			var uPath = "/InvHeaderSet('" + oEvent.getSource().getBindingContext().getObject().Notifid + "')";
			//Make a Backend call
			myModel.update(uPath, obj, {
				merge: false,
				success: function(oData, oResponse) {
					//debugger;
					BusyIndicator.hide();
					that.getView().byId("openDialog").destroy();
				},
				error: function(err, oResponse) {
					//debugger;
					BusyIndicator.hide();
					sap.m.MessageToast.show("Erro Updating Record: " + err.responseText.split('message')[2]);
					MessageBox.error("Erro Updating Record: " + err.responseText.split('message')[2]);
					that.getView().byId("openDialog").destroy();
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

			var dcFilter = [];
			var getValue = this.byId('Dagrp').getText();
			if (getValue) {
				dcFilter.push(new Filter("Codegruppe", FilterOperator.Contains, getValue));
			}
			//	var ExpenseTypeSet = this.getModel().getProperty("/InvDamageCodeShSet");

			var oList = this.getView().byId("damcode");
			var oBinding = oList.getBinding("items");
			oBinding.filter(dcFilter);
			this.getView().byId("damcode").setEnabled(true);

			this.byId('cacode').setSelectedKey(this.byId('Cacode').getText());
			this.byId('cocode').setSelectedKey(this.byId('Cocode').getText());
			this.byId('catxt').setValue(this.byId('Catxt').getText());
			this.byId('ittxt').setValue(this.byId('Ittxt').getText());
			this.byId('icode').setSelectedKey(this.byId('Icode').getText());
			//New Damage Group Field
			this.byId('damgrp').setSelectedKey(this.byId('Dagrp').getText());
			var damCode = this.byId('Dagrp').getText() + this.byId('Dacode').getText();
			this.byId('damcode').setSelectedKey(damCode);
			// Get grow house code
			var inGH = this.byId('Growh').getText();
			var getGH = this.getView().getModel('GHModel').getProperty('/growHouse');
			var selGH = getGH.filter(function(e) {
				return e.Description === inGH;
			});
			var setGH = selGH[0].Code;
			this.byId('growh').setSelectedKey(setGH);
			// Get Rate Type code
			// var inRT = this.byId('Rtype').getText();
			// var getRT = this.getView().getModel('RTModel').getProperty('/rateType');
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
			obj.Codingcode = this.byId('cocode').getSelectedKey();
			obj.Causegrp = "RPRESULT";
			obj.Causecode = this.byId('cacode').getSelectedKey();
			obj.Causeshtxt = this.byId('catxt').getValue();
			obj.Itshtxt = this.byId('ittxt').getValue();
			obj.Itobjpartgrp = "RP010";
			obj.Itobjpartcode = this.byId('icode').getSelectedKey();
			obj.Itdamagegrp = this.byId('damgrp').getSelectedKey();
	
			var getCode = this.byId('damcode').getSelectedKey();
			var newDacode = getCode.substring(5, 8);
			obj.Itdamagecode = newDacode;
			//obj.Itratetype = this.byId('rtype').getValue();
			obj.Itgrowhouse = this.byId('growh').getSelectedKey();
			//obj.Itratetype = this.byId('rtype').getSelectedKey();
	
			var uPath = "/InvHeaderSet('" + oEvent.getSource().getBindingContext().getObject().Notifid + "')";
			//debugger;
			myModel.update(uPath, obj, {
				merge: false,
				success: function(oData, oResponse) {
					//debugger;
					BusyIndicator.hide();
					that.getView().byId("openDialog").destroy();
				},
				error: function(err, oResponse) {
					//debugger;
					BusyIndicator.hide();
					sap.m.MessageToast.show("Erro Updating Record: " + err.responseText.split('message')[2]);
					MessageBox.error("Erro Updating Record: " + err.responseText.split('message')[2]);
					that.getView().byId("openDialog").destroy();
				}

			});
		},

		onPressTask: function(oEvent) {
			var oView = this.getView();
			var oDialog = oView.byId("openDialog");
			//get row data
			var rowData = oEvent.getSource().getBindingContext().getObject();
			//Check If Task is Closed
			if (rowData.Taskstatus === 'TSCO') {
				if (!this.oErrorMessageDialog) {
					this.oErrorMessageDialog = new Dialog({
						type: DialogType.Message,
						title: "Error",
						state: ValueState.Error,
						content: new Text({
							text: "Task Completed. Cannot Make Changes"
						}),
						beginButton: new Button({
							type: ButtonType.Emphasized,
							text: "OK",
							press: function() {
								this.oErrorMessageDialog.close();
							}.bind(this)
						})
					});
				}
				this.oErrorMessageDialog.open();
			}
			//If Task status is not Complted
			else {
				// create dialog lazily
				if (!oDialog) {
					// create dialog via fragment factory
					oDialog = sap.ui.xmlfragment(oView.getId(), "smud.pm.ZPM_RPDS_INVESTIGATIONS.fragments.editTask", this);
					oView.addDependent(oDialog);
				}
				oDialog.open();
				//debugger;
				this.byId('editTask').setTitle(rowData.Taskcodetxt);
				this.byId('taskno').setText(rowData.Tasknumber);
				this.byId('text').setValue(rowData.Taskshrtxt);
				this.byId('tperson').setValue(rowData.Taskperson);
				if (rowData.Userstatus) {
					this.byId('ustat').setSelected(true);
				} else {
					this.byId('ustat').setSelected(false);
				}
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
			//debugger;
			var rowData = oEvent.getSource().getBindingContext().getObject();
			obj.Notifid = rowData.Notifid;
			obj.Taskshrtxt = this.byId('text').getValue();
			obj.Taskperson = this.byId('tperson').getValue();
			obj.Taskperson = obj.Taskperson.toUpperCase();
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
					that.getView().byId("openDialog").destroy();
				},
				error: function(err, oResponse) {
					//	debugger;
					BusyIndicator.hide();
					sap.m.MessageToast.show("Erro Updating Record: " + err.responseText.split('message')[2]);
					MessageBox.error("Erro Updating Record: " + err.responseText.split('message')[2]);
					that.getView().byId("openDialog").destroy();
				}

			});

		},

		onPressPartner: function(oEvent) {
			var oView = this.getView();
			var oDialog = oView.byId("openDialog");
			//debugger;
			//get row data
			var rowData = oEvent.getSource().getBindingContext().getObject();
			// create dialog lazily
			if (!oDialog) {
				// create dialog via fragment factory
				oDialog = sap.ui.xmlfragment(oView.getId(), "smud.pm.ZPM_RPDS_INVESTIGATIONS.fragments.editPartner", this);
				oView.addDependent(oDialog);
			}
			oDialog.open();
			//debugger;
			this.byId('partnum').setText(rowData.Partnumber);
			this.byId('parttype').setText(rowData.Partnerrole);
			// this.byId('cpart').setValue(rowData.Partner);
			this.byId('npart').setValue(rowData.Partner);
		},

		editPartner: function(oEvent) {
			// Set Model to Edit Activity
			var oModel = this.oDataModel("activity");
			sap.ui.getCore().setModel(oModel, "myModel");
			var myModel = sap.ui.getCore().getModel("myModel");
			var obj = {};
			var that = this;
			//Fill data
			//debugger;
			var rowData = oEvent.getSource().getBindingContext().getObject();
			obj.Notifid = rowData.Notifid;
			obj.Partnumber = this.byId('partnum').getText();
			obj.Partnerrole = this.byId('parttype').getText();
			obj.Partner = this.byId('npart').getValue();
			obj.Partner = obj.Partner.toUpperCase();

			//Send a backend request
			var oPath = '/InvPartnersSet(Notifid=' + "'" + rowData.Notifid + "'" + ',Partnumber=' + "'" + obj.Partnumber + "'" + ')';
			BusyIndicator.show();
			myModel.update(oPath, obj, {
				merge: false,
				success: function(oData, oResponse) {
					BusyIndicator.hide();
					that.getView().byId("openDialog").destroy();
				},
				error: function(err, oResponse) {
					//	debugger;
					BusyIndicator.hide();
					sap.m.MessageToast.show("Error Updating Record: " + err.responseText.split('message')[2]);
					MessageBox.error("Erro Updating Record: " + err.responseText.split('message')[2]);
					that.getView().byId("openDialog").destroy();
				}

			});
		},

		deletePartner: function(oEvent) {
			//debugger;
			// Set Model to Delete Partner
			var oModel = this.oDataModel("activity");
			sap.ui.getCore().setModel(oModel, "myModel");
			var myModel = sap.ui.getCore().getModel("myModel");
			var obj = {};
			var that = this;
			//Get Data from screen
			var rowData = oEvent.getSource().getBindingContext().getObject();
			obj.Notifid = rowData.Notifid;
			obj.Partnumber = this.byId('partnum').getText();
			obj.Partnerrole = this.byId('parttype').getText();
			obj.Partner = this.byId('npart').getValue();

			//Create path for Backend call
			var oPath = '/InvPartnersSet(Notifid=' + "'" + rowData.Notifid + "'" + ',Partnumber=' + "'" + obj.Partnumber + "'" + ')';
			BusyIndicator.show();

			myModel.remove(oPath, {
				success: function(oData, oResponse) {
					BusyIndicator.hide();
					that.getView().byId("openDialog").destroy();
				},
				error: function(err, oResponse) {
					//	debugger;
					BusyIndicator.hide();
					sap.m.MessageToast.show("Error Deleated Record: " + err.responseText.split('message')[2]);
					MessageBox.error("Error Deleating Record: " + err.responseText.split('message')[2]);
					that.getView().byId("openDialog").destroy();
				}

			});

		},

		deleteActivity: function(oEvent) {
			//debugger;
			// Set Model to Delete Activity
			var oModel = this.oDataModel("activity");
			sap.ui.getCore().setModel(oModel, "myModel");
			var myModel = sap.ui.getCore().getModel("myModel");
			var obj = {};
			var that = this;
			//Get Data from screen
			var rowData = oEvent.getSource().getBindingContext().getObject();
			obj.Notifid = rowData.Notifid;
			obj.Activityno = this.byId('anum').getText();

			//Create path for Backend call
			var oPath = '/InvActivitiesSet(Notifid=' + "'" + rowData.Notifid + "'" + ',Activityno=' + "'" + obj.Activityno + "'" + ')';
			BusyIndicator.show();

			myModel.remove(oPath, {
				success: function(oData, oResponse) {
					BusyIndicator.hide();
					that.getView().byId("openDialog").destroy();
				},
				error: function(err, oResponse) {
					//	debugger;
					BusyIndicator.hide();
					sap.m.MessageToast.show("Error Deleated Record: " + err.responseText.split('message')[2]);
					MessageBox.error("Error Deleating Record: " + err.responseText.split('message')[2]);
					that.getView().byId("openDialog").destroy();
				}

			});

		},

		deleteTask: function(oEvent) {
			//debugger;
			// Set Model to Delete Task
			var oModel = this.oDataModel("activity");
			sap.ui.getCore().setModel(oModel, "myModel");
			var myModel = sap.ui.getCore().getModel("myModel");
			var obj = {};
			var that = this;
			//Get Data from screen
			var rowData = oEvent.getSource().getBindingContext().getObject();
			obj.Notifid = rowData.Notifid;
			obj.Tasknumber = this.byId('taskno').getText();

			//Create path for Backend call
			var oPath = '/InvTasksSet(Notifid=' + "'" + rowData.Notifid + "'" + ',Tasknumber=' + "'" + obj.Tasknumber + "'" + ')';
			BusyIndicator.show();

			myModel.remove(oPath, {
				success: function(oData, oResponse) {
					BusyIndicator.hide();
					that.getView().byId("openDialog").destroy();
				},
				error: function(err, oResponse) {
					//	debugger;
					BusyIndicator.hide();
					sap.m.MessageToast.show("Error Deleated Record: " + err.responseText.split('message')[2]);
					MessageBox.error("Error Deleating Record: " + err.responseText.split('message')[2]);
					that.getView().byId("openDialog").destroy();
				}

			});

		},

		onPressActivity: function(oEvent) {
			var oView = this.getView();
			var oDialog = oView.byId("openDialog");
			//debugger;
			//get row data
			var rowData = oEvent.getSource().getBindingContext().getObject();
			// create dialog lazily
			if (!oDialog) {
				// create dialog via fragment factory
				oDialog = sap.ui.xmlfragment(oView.getId(), "smud.pm.ZPM_RPDS_INVESTIGATIONS.fragments.editActivity", this);
				oView.addDependent(oDialog);
			}
			oDialog.open();
			//debugger;
			this.byId('anum').setText(rowData.Activityno);
			this.byId('agrp').setText(rowData.Activitygrp);
			this.byId('acode').setValue(rowData.Activitycode);
			this.byId('aamt').setValue(rowData.Activitytxt);
			// this.byId('adate').setDateValue(rowData.Activitystrdate);
			this.byId('adate').setDateValue(rowData.Activitytimestmp);
		},
		editActivity: function(oEvent) {
			// Set Model to Edit Activity
			var oModel = this.oDataModel("activity");
			sap.ui.getCore().setModel(oModel, "myModel");
			var myModel = sap.ui.getCore().getModel("myModel");
			var obj = {};
			var that = this;
			//Fill data
			//debugger;
			var rowData = oEvent.getSource().getBindingContext().getObject();
			obj.Notifid = rowData.Notifid;
			obj.Activityno = this.byId('anum').getText();
			obj.Activitygrp = this.byId('agrp').getText();
			obj.Activitycode = this.byId('acode').getValue();
			obj.Activitytxt = this.byId('aamt').getValue();
			obj.Activitystrdate = this.byId('adate').getValue() + "T00:00:00";

			//Validate Date
			var oStartDate = this.byId('adate').getValue();
			var oAmount = this.byId('aamt').getValue();
			if (oStartDate === "" || oAmount === "") {
				this.byId('adate').setValueState(sap.ui.core.ValueState.Error);
				if (oAmount === "") {
					this.byId('aamt').setValueState(sap.ui.core.ValueState.Error);
				}
			} else {

				//Send a backend request
				var oPath = '/InvActivitiesSet(Notifid=' + "'" + rowData.Notifid + "'" + ',Activityno=' + "'" + obj.Activityno + "'" + ')';
				BusyIndicator.show();
				myModel.update(oPath, obj, {
					merge: false,
					success: function(oData, oResponse) {
						BusyIndicator.hide();
						that.getView().byId("openDialog").destroy();
					},
					error: function(err, oResponse) {
						//	debugger;
						BusyIndicator.hide();
						sap.m.MessageToast.show("Erro Updating Record: " + err.responseText.split('message')[2]);
						MessageBox.error("Erro Updating Record: " + err.responseText.split('message')[2]);
						that.getView().byId("openDialog").destroy();
					}

				});
			};

		},

		onPressAttachment: function(oEvent) {
			//debugger;
			var url = oEvent.getSource().getBindingContext().getObject().Docuri;
			window.open(url);
		},

		dialogAfterclose: function(oEvent) {
			//debugger;
			this.getView().byId("openDialog").destroy();

		},

		dialogClear: function() {
			this.byId('amount').setValue('');
			this.byId('date').setValue('');
		},

		/**Hanel Attachment logic
		 **/

		handleUploadPress: function(oEvent) {
			//debugger;
			var oFileUploader = this.getView().byId("fileUploader");
			var oDocType = this.byId('rbg3').getSelectedButton().getText();
			var oNotifId = oEvent.getSource().getParent().getBindingContext().getObject().Notifid;
			var oFileName = oFileUploader.getValue();
			var oFileType = oFileName.split('.').pop();
			var oSlug = oDocType + '#' + oNotifId + '#' + oFileName + '#' + oFileType;

			if (oFileUploader.getValue() === "") {
				MessageToast.show("Please Select a  File");
			}
			oFileUploader.addHeaderParameter(new sap.ui.unified.FileUploaderParameter({
				name: "SLUG",
				value: oSlug
					//value: oFileUploader.getValue()
			}));
			oFileUploader.addHeaderParameter(new sap.ui.unified.FileUploaderParameter({
				name: "x-csrf-token",
				value: this.getCSRFToken()
			}));
			oFileUploader.setSendXHR(true);
			// oFileUploader.setUploadUrl('/sap/opu/odata/sap/ZTEST_CRUD_SRV/fileuploadSet');

			oFileUploader.upload();
			if (oFileUploader.getValue()) {
				sap.ui.core.BusyIndicator.show();
			}

		},

		getCSRFToken: function() {
			//debugger;
			var oModel = this.oDataModel("attach");
			var sTokenName = "x-cs" + "rf-token"; // avoid static code check errors
			var sToken = oModel.getHeaders()[sTokenName];
			if (!sToken) {
				oModel.refreshSecurityToken(
					function(e, o) {
						sToken = o.headers[sTokenName];
					},
					function() {
						//jQuery.sap.log.error("Could not get XSRF token");
						MessageBox.error("Could not get XSRF token");
					},
					false);
			}
			return sToken;
		},

		handleUploadComplete: function(oEvent) {
			// Display Error
			// var oStatus = oEvent.getParameter("status");
			// var oResponse = oEvent.getParameter("response");
			// if (oStatus === 500) {
			// 	MessageBox.error("Communication Error: Please Refresh and Try again  ----  " + oResponse);
			// }

			// refresh model binding
			this.getView().getElementBinding().refresh(true);
			//debugger;
			//this.byId('fileUploader').getProperty('value').setValue('');
			oEvent.getSource().setValue("");
			sap.ui.core.BusyIndicator.hide();
			this.getView().byId("openDialog").destroy();

			// var error = oEvent.getParameters().response;
			// if (error) {
			// 	MessageBox.error(error);
			// }
		},

		fileTypeError: function(oEvent) {
			MessageBox.error("Invalid File Format: use only - txt,jpg,pdf,doc,docx,xls,xlxs");
		},

		handleValueChange: function(oEvent) {
			MessageToast.show("Press 'Upload File' to upload file '" +
				oEvent.getParameter("newValue") + "'");
		},

		/** Create attachment through Dialog Window */

		newAttachment: function() {
			var oView = this.getView();
			var oDialog = oView.byId("openDialog");
			// create dialog lazily
			if (!oDialog) {
				// create dialog via fragment factory
				oDialog = sap.ui.xmlfragment(oView.getId(), "smud.pm.ZPM_RPDS_INVESTIGATIONS.fragments.newAttachment", this);
				oView.addDependent(oDialog);
			}
			oDialog.open();

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