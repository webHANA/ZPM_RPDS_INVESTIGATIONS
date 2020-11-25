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
		}

	};

});