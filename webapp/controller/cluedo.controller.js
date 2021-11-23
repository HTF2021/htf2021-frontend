sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast",
	"sap/ui/model/json/JSONModel",
	"sap/m/Dialog",
	"sap/m/DialogType",
	"sap/m/Button",
	"sap/m/Text",
	"sap/ui/core/BusyIndicator"
],
	function (Controller,
		MessageToast,
		JSONModel,
		Dialog,
		DialogType,
		Button,
		Text,
		BusyIndicator) {
		"use strict";
		var botStatuses = [true, true, true, true];
		const dataBaseUrl = "https://htf-2021.herokuapp.com";
		return Controller.extend("com.flexso.htf2021.controller.cluedo", {
			// REQUIRED
			onInit: function () {
				// Load data from "http://localhost:3000/data" into JSONModel named "cluedoModel" and make it available for the View
				// After data call success, set image source from model data ("startImage" -> Title HTF, "grondplanImg" -> Grondplan Spel)


				/*$.ajax({
					url: "http://localhost:3000/data",
					type: "GET",
					cache: false,
					accept: "application/json"
				}).then((oData, textstatus, jqXHR) => {
					this.getView().setModel(new JSONModel(oData), 'cluedoModel');
					const startImage = dataBaseUrl + this.getView().getModel('cluedoModel').getData().others[0].url;
					this.getView().byId("startImage").setProperty("src", startImage);
					const grondplan = dataBaseUrl + this.getView().getModel('cluedoModel').getData().grondplannen[1].url;
					this.getView().byId("grondplanImg").setProperty("src", grondplan);
				}).catch(() => {
					MessageToast.show(this.getView().getModel("i18n").getProperty("loadDataFailed"));
				});*/
			},

			// REQUIRED
			onStartPress: function () {
				// Create new solution to start game using new_solution call
				// Create playground & show MessageToast (or something creative) when solution has been created

				/*$.ajax({
					url: "http://localhost:3000/new_solution",
					type: "GET",
					cache: false,
					accept: "application/json"
				}).then((oData, textstatus, jqXHR) => {
					// Prepare playground
					this._buildPlayground();
					MessageToast.show(this.getView().getModel("i18n").getProperty("newGame"));
				}).catch(() => {
					MessageToast.show(this.getView().getModel("i18n").getProperty("newGameFailed"));
				});*/
			},

			// BONUS
			changeWapenImage: function () {
				/*const selectedItemText = this.getView().byId("wapen").getSelectedItem().getText();
				const selectedWapen = this.getView().getModel("cluedoModel").getData().wapens.filter((ele) => ele.name === selectedItemText)[0];
				this.getView().byId("wapenImage").setProperty("src", dataBaseUrl + selectedWapen.url);*/
			},

			// BONUS
			changeDaderImage: function () {
				/*const selectedItemText = this.getView().byId("dader").getSelectedItem().getText();
				const selectedDader = this.getView().getModel("cluedoModel").getData().daders.filter((ele) => ele.name === selectedItemText)[0];
				this.getView().byId("daderImage").setProperty("src", dataBaseUrl + selectedDader.url);*/
			},
			
			onValidatePress: function (evt) {
				const amountOfBots = this.getView().byId("amountBots").getValue();
				const killerActivated = this.getView().byId("playWithKiller").getState();

				// REQUIRED
				const answer = {
					"wapen": {
						"id": "" //parseInt(this.getView().byId("wapen").getSelectedKey())
					},
					"dader": {
						"id": "" //parseInt(this.getView().byId("dader").getSelectedKey())
					},
					"kamer": {
						"id": "" //parseInt(this.getView().byId("kamer").getSelectedKey())
					}
				}
				const oData = {
					data: {
						answer: answer,
						amountOfBots: amountOfBots,
						killerActivated: killerActivated,
						botStatuses: botStatuses
					}
				};
				if (answer != undefined) {
					$.ajax({
						url: "http://localhost:3000/check_answer",
						type: "POST",
						cache: false,
						accept: "*/*",
						data: oData,
						contenttype: "application/json"
					}).then((oData, textstatus, jqXHR) => {
						this.getView().byId('wapenIcon').setVisible(true);
						this.getView().byId('daderIcon').setVisible(true);
						this.getView().byId('kamerIcon').setVisible(true);

						// PLAYER: REQUIRED
						this._displayPlayerGuesses(oData);
						// If the player won, show _endOfGameDialog
						/*if (oData.checks.player.dader === true && oData.checks.player.wapen === true && oData.checks.player.kamer === true) {
							const title = this.getView().getModel("i18n").getProperty("titlePlayerWon");
							const message = this.getView().getModel("i18n").getProperty("messagePlayerWon");
							this._endOfGameDialog(title, message);
						}*/
						
						// KILLER: BONUS
						// Check if player died -> show _endOfGameDialog
						/*if (oData.statuses.player == false) {
							var title = this.getView().getModel("i18n").getProperty("titleKillerKilledPlayer");
							var message = this.getView().getModel("i18n").getProperty("messageKillerKilledPlayer");
							this._endOfGameDialog(title, message);
						}*/

						// BOTS: BONUS
						/*if (amountOfBots > 0) {
							this._setBotOnBoard(oData);
							this._displayBotGuesses(oData);

							for (let botNr = 0; botNr < oData.checks.bots.length; botNr++) {
								if(!oData.statuses.bots[botNr]){
									break;
								}
								if (oData.checks.bots[botNr].dader == true && oData.checks.bots[botNr].wapen == true && oData.checks.bots[botNr].kamer == true) {
									const title = this.getView().getModel("i18n").getProperty("titleBotWon");
									const message = this.getView().getModel("i18n").getProperty("messageBotWon");
									this._endOfGameDialog(title, message);
								}
							}

						}*/
					}).catch(() => {
						MessageToast.show(this.getView().getModel("i18n").getProperty("checkFailed"));
					});
				}
			},
			_endOfGameDialog: function (title, message) {
				// Show a dialog with restart button to inform the player.
				/*if (!this.oEndOfGame) {
					this.oEndOfGame = new Dialog({
						title: title,
						content: new Text({ text: message }),
						type: DialogType.Message,
						buttons: [
							new Button({
								text: this.getView().getModel("i18n").getProperty("playAgain"),
								press: function () {
									this.oEndOfGame.close();
									this.onStartPress();
								}.bind(this)
							})
						]
					});
				}
				this.oEndOfGame.open();*/
			},
			_setBotOnBoard: function (botData) {
				// Refresh buttons to reposition bots (default true)
				this._setKamerButtonsEnabled();
				// Set buttons for bot locations disabled
				for (let i = 0; i < botData.botLocations.length; i++) {
					const botKamer = botData.botLocations[i]
					if (botKamer) {
						this.getView().byId(botKamer.toLowerCase() + "Button").setEnabled(false);
					}
				}
			},
			_displayPlayerGuesses: function (playerData) {
				if (playerData.checks.player.wapen) {
					this.getView().byId('wapenIcon').setProperty("src", "sap-icon://accept");
					this.getView().byId('wapenIcon').setProperty("color", "green");
				} else {
					this.getView().byId('wapenIcon').setProperty("src", "sap-icon://decline");
					this.getView().byId('wapenIcon').setProperty("color", "red");
				}
				if (playerData.checks.player.dader) {
					this.getView().byId('daderIcon').setProperty("src", "sap-icon://accept");
					this.getView().byId('daderIcon').setProperty("color", "green");
				} else {
					this.getView().byId('daderIcon').setProperty("src", "sap-icon://decline");
					this.getView().byId('daderIcon').setProperty("color", "red");
				}
				if (playerData.checks.player.kamer) {
					this.getView().byId('kamerIcon').setProperty("src", "sap-icon://accept");
					this.getView().byId('kamerIcon').setProperty("color", "green");
				} else {
					this.getView().byId('kamerIcon').setProperty("src", "sap-icon://decline");
					this.getView().byId('kamerIcon').setProperty("color", "red");
				}
			},
			_displayBotGuesses: function (botData) {
				for (let i = 0; i < botData.checks.bots.length; i++) {
					if(!botData.statuses.bots[i]){
						break;
					}

					const botKamerValue = botData.checks.bots[i].kamer;
					const botWapenValue = botData.checks.bots[i].wapen;
					const botDaderValue = botData.checks.bots[i].dader;

					let botNr = i + 1;
					this.getView().byId("bot" + botNr + "HBox").setVisible(false);
					this.getView().byId("bot" + botNr + "HBox").setVisible(true);
					if (botKamerValue) {
						this.getView().byId("bot" + botNr + "KamerIcon").setProperty("src", "sap-icon://accept");
						this.getView().byId("bot" + botNr + "KamerIcon").setProperty("color", "green");
					} else {
						this.getView().byId("bot" + botNr + "KamerIcon").setProperty("src", "sap-icon://decline");
						this.getView().byId("bot" + botNr + "KamerIcon").setProperty("color", "red");
					}
					if (botWapenValue) {
						this.getView().byId("bot" + botNr + "WapenIcon").setProperty("src", "sap-icon://accept");
						this.getView().byId("bot" + botNr + "WapenIcon").setProperty("color", "green");
					} else {
						this.getView().byId("bot" + botNr + "WapenIcon").setProperty("src", "sap-icon://decline");
						this.getView().byId("bot" + botNr + "WapenIcon").setProperty("color", "red");
					}
					if (botDaderValue) {
						this.getView().byId("bot" + botNr + "DaderIcon").setProperty("src", "sap-icon://accept");
						this.getView().byId("bot" + botNr + "DaderIcon").setProperty("color", "green");
					} else {
						this.getView().byId("bot" + botNr + "DaderIcon").setProperty("src", "sap-icon://decline");
						this.getView().byId("bot" + botNr + "DaderIcon").setProperty("color", "red");
					}
				}
			},

			// REQUIRED
			// Set the correct room in dropdown (for each button);
			onBalzaalPress: function () {
				//this.getView().byId("kamer").setSelectedKey("0");
				const selected = [1, 0, 0, 0, 0, 0, 0, 0, 0];
				this._setKamerButtonSelected(selected);
			},

			onBibliotheekPress: function () {
				//this.getView().byId("kamer").setSelectedKey("1");
				const selected = [1, 0, 0, 0, 0, 0, 0, 0, 0];
				this._setKamerButtonSelected(selected);
			},
			onBiljartkamerPress: function () {
				//this.getView().byId("kamer").setSelectedKey("2");
				const selected = [0, 1, 0, 0, 0, 0, 0, 0, 0];
				this._setKamerButtonSelected(selected);
			},
			onEetkamerPress: function () {
				//this.getView().byId("kamer").setSelectedKey("3");
				const selected = [0, 0, 1, 0, 0, 0, 0, 0, 0];
				this._setKamerButtonSelected(selected);
			},
			onHalPress: function () {
				//this.getView().byId("kamer").setSelectedKey("4");
				const selected = [0, 0, 0, 1, 0, 0, 0, 0, 0];
				this._setKamerButtonSelected(selected);
			},
			onKeukenPress: function () {
				//this.getView().byId("kamer").setSelectedKey("5");
				const selected = [, 0, 0, 0, 0, 1, 0, 0, 0];
				this._setKamerButtonSelected(selected);
			},
			onSerrePress: function () {
				//this.getView().byId("kamer").setSelectedKey("6");
				const selected = [0, 0, 0, 0, 0, 0, 1, 0, 0];
				this._setKamerButtonSelected(selected);
			},
			onStudeerkamerPress: function () {
				//this.getView().byId("kamer").setSelectedKey("7");
				const selected = [0, 0, 0, 0, 0, 0, 0, 1, 0];
				this._setKamerButtonSelected(selected);
			},
			onZitkamerPress: function () {
				//this.getView().byId("kamer").setSelectedKey("8");
				const selected = [0, 0, 0, 0, 0, 0, 0, 0, 1];
				this._setKamerButtonSelected(selected);
			},

			_buildPlayground: function () {
				this.getView().byId("start").setVisible(false);
				this.getView().byId("startImage").setVisible(false);
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
				
				this.getView().byId("balzaalButton").setEnabled(true);
				this.getView().byId("bibliotheekButton").setEnabled(true);
				this.getView().byId("biljartkamerButton").setEnabled(true);
				this.getView().byId("eetkamerButton").setEnabled(true);
				this.getView().byId("halButton").setEnabled(true);
				this.getView().byId("keukenButton").setEnabled(true);
				this.getView().byId("serreButton").setEnabled(true);
				this.getView().byId("studeerkamerButton").setEnabled(true);
				this.getView().byId("zitkamerButton").setEnabled(true);
				
				this.getView().byId("grondplanImg").setVisible(true);
				this.getView().byId("wapen").setVisible(true);
				this.getView().byId("dader").setVisible(true);
				this.getView().byId("kamer").setVisible(true);
				this.getView().byId("valideer").setVisible(true);
				this.getView().byId("wapen").setValue(null);
				this.getView().byId("dader").setValue(null);
				this.getView().byId("kamer").setValue(null);
				this.getView().byId('daderIcon').setVisible(false);
				this.getView().byId('wapenIcon').setVisible(false);
				this.getView().byId('kamerIcon').setVisible(false);

				// Make bots visible
				for (let botNr = 1; botNr <= 4; botNr++) {
					this.getView().byId("bot" + botNr + "HBox").setVisible(false);
				}
			},
			_setKamerButtonSelected: function (selected) {
				// Set player selected button as Accept type
				const rooms = [
					this.getView().byId("balzaalButton"),
					this.getView().byId("bibliotheekButton"),
					this.getView().byId("biljartkamerButton"),
					this.getView().byId("eetkamerButton"),
					this.getView().byId("halButton"),
					this.getView().byId("keukenButton"),
					this.getView().byId("serreButton"),
					this.getView().byId("studeerkamerButton"),
					this.getView().byId("zitkamerButton")
				];
				for(let i = 0; i < selected.length; i++){
					rooms[i].setType("Reject");
				}
				for(let i = 0; i < selected.length; i++){
					if(selected[i] === 1){
						rooms[i].setType("Accept");
					}
				}
			},
			_setKamerButtonsEnabled: function () {
				// Set kamer buttons to default: true
				this.getView().byId("balzaalButton").setEnabled(true);
				this.getView().byId("bibliotheekButton").setEnabled(true);
				this.getView().byId("biljartkamerButton").setEnabled(true);
				this.getView().byId("eetkamerButton").setEnabled(true);
				this.getView().byId("halButton").setEnabled(true);
				this.getView().byId("keukenButton").setEnabled(true);
				this.getView().byId("serreButton").setEnabled(true);
				this.getView().byId("studeerkamerButton").setEnabled(true);
				this.getView().byId("zitkamerButton").setEnabled(true);
			}
		});
	});
