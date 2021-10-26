/*global QUnit*/

sap.ui.define([
	"comflexso./htf2021/controller/cluedo.controller"
], function (Controller) {
	"use strict";

	QUnit.module("cluedo Controller");

	QUnit.test("I should test the cluedo controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
