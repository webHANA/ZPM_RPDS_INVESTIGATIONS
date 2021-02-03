sap.ui.define([], function() {
	"use strict";

	return {

		/**
		 * Rounds the number unit value to 2 digits
		 * @public
		 * @param {string} sValue the number string to be rounded
		 * @returns {string} sValue with 2 digits rounded
		 */
		numberUnit: function(sValue) {
			if (!sValue) {
				return "";
			}
			return parseFloat(sValue).toFixed(2);
		},
		noStatus: function(ntxt, ncode) {
			var nStatus = ncode.indexOf("NOCO");
			if (nStatus === -1) {
				this.byId('nstatus').setState('Success');
			} else {
				this.byId('nstatus').setState('Error');
			}
			return ntxt;
		},
		partnerFormatter: function(sValue) {
			var resourceBundle = this.getView().getModel("i18n").getResourceBundle();
			switch (sValue) {
				case "ZI":
					return resourceBundle.getText("ziInspector");
				case "ZV":
					return resourceBundle.getText("zvInvestigator");
				case "PY":
					return resourceBundle.getText("pyPayer");
				case "SP":
					return resourceBundle.getText("spSoldTo");
				default:
					return sValue;
			}
		},
		priFormatter: function(sValue) {
			var resourceBundle = this.getView().getModel("i18n").getResourceBundle();

			switch (sValue) {
				case "C":
					return resourceBundle.getText("priC");
				case "R":
					return resourceBundle.getText("priR");
				case "0":
					return resourceBundle.getText("pri0");
				default:
					return sValue;
			}

		},
		docTypFormatter: function(sValue) {
			var resourceBundle = this.getView().getModel("i18n").getResourceBundle();
			switch (sValue) {
				case "ZPMPTIPI":
					return resourceBundle.getText("invDoc");
				case "ZPMPTIBD":
					return resourceBundle.getText("billDoc");
				case "ZPMPTID":
					return resourceBundle.getText("theftDoc");
				default:
					return sValue;
			}

		},
		cocodeFormatter: function(sValue) {
			if (sValue) {
			//	debugger;
				return sValue;
				// return function() {
				// 	this.getOwnerComponent().getModel().read("/InvCodingCodeShSet(Codegruppe='RPDS',Code='" + sValue + "')", {
				// 		success: function(OData, response) {
				// 			debugger;
				// 			var returnObj = OData.Kurztext;
				// 			return returnObj;
				// 		},
				// 		error: function(oError) {
				// 			debugger;
				// 			//Error Message
				// 			return null;
				// 		}
				// 	});
				// }
			} else
				return sValue;
		},
		numberformat: function(sValue) {

		}

	};

});