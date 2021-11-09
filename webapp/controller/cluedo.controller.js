sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast",
	"sap/ui/model/json/JSONModel",
	"sap/m/Dialog",
	"sap/m/DialogType",
	"sap/m/Button",
	"sap/m/Text"
],
	/**
	 * @param {typeof sap.ui.core.mvc.Controller} Controller
	 */
	function (Controller,
		MessageToast,
		JSONModel,
		Dialog,
		DialogType,
		Button,
		Text) {
		"use strict";
		return Controller.extend("com.flexso.htf2021.controller.cluedo", {

			onInit: function () {
				$.ajax({
					url: "http://localhost:3000/data",
					type: "GET",
					cache: false,
					accept: "application/json"
				}).then((oData, textstatus, jqXHR) => {
					this.getView().setModel(new JSONModel(oData), 'cluedoModel');
					let grondplan = "https://htf-2021.herokuapp.com" + this.getView().getModel('cluedoModel').getData().grondplannen[1].url;
					this.getView().byId("grondplanImg").setProperty("src", grondplan);

					let startPlan = "https://htf-2021.herokuapp.com" + this.getView().getModel('cluedoModel').getData().grondplannen[0].url;
					this.getView().byId("startImage").setProperty("src", startPlan);
				}).catch(() => {
					MessageToast.show("Could not load game data.");
				});
			},
			_startNewGame: function () {
				$.ajax({
					url: "http://localhost:3000/new_solution",
					type: "GET",
					cache: false,
					accept: "application/json"
				}).then((oData, textstatus, jqXHR) => {
					MessageToast.show("New game started!");
				}).catch(() => {
					MessageToast.show("Could not start new game.");
				});
			},

			onStartPress: function () {
				var startButton = this.getView().byId("start");
				if (startButton.getText() == "Start") {
					this.getView().byId("startImage").setVisible(false);
					startButton.setVisible(false);
					this.getView().byId("botKillerHBox").setVisible(false);

					this.getView().byId("balzaalButton").setVisible(true);
					this.getView().byId("bibliotheekButton").setVisible(true);
					this.getView().byId("biljartkamerButton").setVisible(true);
					this.getView().byId("eetkamerButton").setVisible(true);
					this.getView().byId("halButton").setVisible(true);
					this.getView().byId("keukenButton").setVisible(true);
					this.getView().byId("serreButton").setVisible(true);
					this.getView().byId("studeerkamerButton").setVisible(true);
					this.getView().byId("zitkamerButton").setVisible(true);
					this.getView().byId("grondplanImg").setVisible(true);

					this.getView().byId("wapen").setVisible(true);
					this.getView().byId("dader").setVisible(true);
					this.getView().byId("kamer").setVisible(true);
					this.getView().byId("valideer").setVisible(true);

					console.log(this.getView().byId("amountBots").getValue());
					console.log(this.getView().byId("playWithKiller").getState());
				} else {
					this.getView().byId("wapen").setValue(null);
					this.getView().byId("dader").setValue(null);
					this.getView().byId("kamer").setValue(null);

					this.getView().byId('daderIcon').setVisible(false);
					this.getView().byId('wapenIcon').setVisible(false);
					this.getView().byId('kamerIcon').setVisible(false);
				}

				this._startNewGame();

			},
			onValidatePress: function (evt) {
				console.log(this.getView().byId("amountBots").getValue());
				console.log(this.getView().byId("playWithKiller").getState());

				let amountOfBots = this.getView().byId("amountBots").getValue();
				let killerActivated = this.getView().byId("playWithKiller").getState();
				let answer = {
					"wapen": {
						"id": parseInt(this.getView().byId("wapen").getSelectedKey())
					},
					"dader": {
						"id": parseInt(this.getView().byId("dader").getSelectedKey())
					},
					"kamer": {
						"id": parseInt(this.getView().byId("kamer").getSelectedKey())
					}
				}
				var oData = {
					data: {
						answer: answer,
						amountOfBots: amountOfBots,
						killerActivated, killerActivated
					}
				}
				//console.log(answer);
				if(answer != undefined){// TODO: Check data is filled in
					$.ajax({
						url: "http://localhost:3000/check_answer",
						type: "POST",
						cache: false,
						accept: "*/*",
						data: oData,
						contenttype: "application/json"
					}).then((oData, textstatus, jqXHR) => {
						if (oData.checks.dader === true && oData.checks.wapen === true && oData.checks.kamer === true) {
							this.getView().byId('wapenIcon').setProperty("src", "sap-icon://accept");
							this.getView().byId('kamerIcon').setProperty("src", "sap-icon://accept");
							this.getView().byId('daderIcon').setProperty("src", "sap-icon://accept");

							if (!this.oEscapePreventDialog) {
								this.oEscapePreventDialog = new Dialog({
									title: "Congrats you win!",
									content: new Text({ text: "Congrats you won this game of Flexso Cluedo!" }),
									type: DialogType.Message,
									buttons: [
										new Button({
											text: "Play again",
											press: function () {
												this.oEscapePreventDialog.close();
												this.onStartPress();
											}.bind(this)
										})
									]
								});
							}
							this.oEscapePreventDialog.open();


							this.oDefaultDialog.open();
						} else {
							if (oData.checks.wapen) {
								this.getView().byId('wapenIcon').setProperty("src", "sap-icon://accept");
							} else {
								this.getView().byId('wapenIcon').setProperty("src", "sap-icon://decline");
							}
							if (oData.checks.dader) {
								this.getView().byId('daderIcon').setProperty("src", "sap-icon://accept");
							} else {
								this.getView().byId('daderIcon').setProperty("src", "sap-icon://decline");
							}
							if (oData.checks.kamer) {
								this.getView().byId('kamerIcon').setProperty("src", "sap-icon://accept");
							} else {
								this.getView().byId('kamerIcon').setProperty("src", "sap-icon://decline");
							}
						}
					}).catch(() => {
						MessageToast.show("Could check the answer. Please try again.");
					});
				}
			},
			onBalzaalPress: function () {
				MessageToast.show("Balzaal");
				this.getView().byId("kamer").setSelectedKey("0");
				this.getView().byId("kamer").setValue("Balzaal");

				this.getView().byId("balzaalButton").setType("Accept");
				this.getView().byId("bibliotheekButton").setType("Reject");
				this.getView().byId("biljartkamerButton").setType("Reject");
				this.getView().byId("eetkamerButton").setType("Reject");
				this.getView().byId("halButton").setType("Reject");
				this.getView().byId("keukenButton").setType("Reject");
				this.getView().byId("serreButton").setType("Reject");
				this.getView().byId("studeerkamerButton").setType("Reject");
				this.getView().byId("zitkamerButton").setType("Reject");
			},
			onBibliotheekPress: function () {
				MessageToast.show("Bibliotheek");
				this.getView().byId("kamer").setSelectedKey("1");
				this.getView().byId("kamer").setValue("Bibliotheek");

				this.getView().byId("balzaalButton").setType("Reject");
				this.getView().byId("bibliotheekButton").setType("Accept");
				this.getView().byId("biljartkamerButton").setType("Reject");
				this.getView().byId("eetkamerButton").setType("Reject");
				this.getView().byId("halButton").setType("Reject");
				this.getView().byId("keukenButton").setType("Reject");
				this.getView().byId("serreButton").setType("Reject");
				this.getView().byId("studeerkamerButton").setType("Reject");
				this.getView().byId("zitkamerButton").setType("Reject");
			},
			onBiljartkamerPress: function () {
				MessageToast.show("Biljartkamer");
				this.getView().byId("kamer").setSelectedKey("2");
				this.getView().byId("kamer").setValue("Biljartkamer");

				this.getView().byId("balzaalButton").setType("Reject");
				this.getView().byId("bibliotheekButton").setType("Reject");
				this.getView().byId("biljartkamerButton").setType("Accept");
				this.getView().byId("eetkamerButton").setType("Reject");
				this.getView().byId("halButton").setType("Reject");
				this.getView().byId("keukenButton").setType("Reject");
				this.getView().byId("serreButton").setType("Reject");
				this.getView().byId("studeerkamerButton").setType("Reject");
				this.getView().byId("zitkamerButton").setType("Reject");
			},
			onEetkamerPress: function () {
				MessageToast.show("Eetkamer");
				this.getView().byId("kamer").setSelectedKey("3");
				this.getView().byId("kamer").setValue("Eetkamer");

				this.getView().byId("balzaalButton").setType("Reject");
				this.getView().byId("bibliotheekButton").setType("Reject");
				this.getView().byId("biljartkamerButton").setType("Reject");
				this.getView().byId("eetkamerButton").setType("Accept");
				this.getView().byId("halButton").setType("Reject");
				this.getView().byId("keukenButton").setType("Reject");
				this.getView().byId("serreButton").setType("Reject");
				this.getView().byId("studeerkamerButton").setType("Reject");
				this.getView().byId("zitkamerButton").setType("Reject");
			},
			onHalPress: function () {
				MessageToast.show("Hal");
				this.getView().byId("kamer").setSelectedKey("4");
				this.getView().byId("kamer").setValue("Hal");

				this.getView().byId("balzaalButton").setType("Reject");
				this.getView().byId("bibliotheekButton").setType("Reject");
				this.getView().byId("biljartkamerButton").setType("Reject");
				this.getView().byId("eetkamerButton").setType("Reject");
				this.getView().byId("halButton").setType("Accept");
				this.getView().byId("keukenButton").setType("Reject");
				this.getView().byId("serreButton").setType("Reject");
				this.getView().byId("studeerkamerButton").setType("Reject");
				this.getView().byId("zitkamerButton").setType("Reject");
			},
			onKeukenPress: function () {
				MessageToast.show("Keuken");
				this.getView().byId("kamer").setSelectedKey("5");
				this.getView().byId("kamer").setValue("Keuken");

				this.getView().byId("balzaalButton").setType("Reject");
				this.getView().byId("bibliotheekButton").setType("Reject");
				this.getView().byId("biljartkamerButton").setType("Reject");
				this.getView().byId("eetkamerButton").setType("Reject");
				this.getView().byId("halButton").setType("Reject");
				this.getView().byId("keukenButton").setType("Accept");
				this.getView().byId("serreButton").setType("Reject");
				this.getView().byId("studeerkamerButton").setType("Reject");
				this.getView().byId("zitkamerButton").setType("Reject");
			},
			onSerrePress: function () {
				MessageToast.show("Serre");
				this.getView().byId("kamer").setSelectedKey("6");
				this.getView().byId("kamer").setValue("Serre");

				this.getView().byId("balzaalButton").setType("Reject");
				this.getView().byId("bibliotheekButton").setType("Reject");
				this.getView().byId("biljartkamerButton").setType("Reject");
				this.getView().byId("eetkamerButton").setType("Reject");
				this.getView().byId("halButton").setType("Reject");
				this.getView().byId("keukenButton").setType("Reject");
				this.getView().byId("serreButton").setType("Accept");
				this.getView().byId("studeerkamerButton").setType("Reject");
				this.getView().byId("zitkamerButton").setType("Reject");
			},
			onStudeerkamerPress: function () {
				MessageToast.show("Studeerkamer");
				this.getView().byId("kamer").setSelectedKey("7");
				this.getView().byId("kamer").setValue("Studeerkamer");

				this.getView().byId("balzaalButton").setType("Reject");
				this.getView().byId("bibliotheekButton").setType("Reject");
				this.getView().byId("biljartkamerButton").setType("Reject");
				this.getView().byId("eetkamerButton").setType("Reject");
				this.getView().byId("halButton").setType("Reject");
				this.getView().byId("keukenButton").setType("Reject");
				this.getView().byId("serreButton").setType("Reject");
				this.getView().byId("studeerkamerButton").setType("Accept");
				this.getView().byId("zitkamerButton").setType("Reject");
			},
			onZitkamerPress: function () {
				MessageToast.show("Zitkamer");
				this.getView().byId("kamer").setSelectedKey("8");
				this.getView().byId("kamer").setValue("Zitkamer");

				this.getView().byId("balzaalButton").setType("Reject");
				this.getView().byId("bibliotheekButton").setType("Reject");
				this.getView().byId("biljartkamerButton").setType("Reject");
				this.getView().byId("eetkamerButton").setType("Reject");
				this.getView().byId("halButton").setType("Reject");
				this.getView().byId("keukenButton").setType("Reject");
				this.getView().byId("serreButton").setType("Reject");
				this.getView().byId("studeerkamerButton").setType("Reject");
				this.getView().byId("zitkamerButton").setType("Accept");
			}
		});
	});
