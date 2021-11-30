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
		const localBaseUrl = "http://localhost:3000";
		return Controller.extend("com.flexso.htf2021.controller.cluedo", {
			onInit: function () {
				//FIXME: REQUIRED 1
				// Load data from const localBaseUrl + "/data" into JSONModel named "cluedoModel" and make it available for the View
				// After data call success, set image source from model data ("startImage" -> Title HTF, "grondplanImg" -> Grondplan Spel)
			},

			
			onStartPress: function () {
				// FIXME: REQUIRED 2
				// Create new solution to start game using const localBaseUrl + "/new_solution" call
				// When the solution has been created, call _buildPlayground function & show MessageToast (or something creative) when solution has been created
			},

			
			changeWapenImage: function () {
				// TODO: BONUS
				// Read image url from model data. Look up the correct image tag in XML view. Then set the image source.
				// Tip: do not forget dataBaseUrl!
			},

			
			changeDaderImage: function () {
				// TODO: BONUS
				// Read image url from model data. Look up the correct image tag in XML view. Then set the image source.
				// Tip: do not forget dataBaseUrl!
			},
			
			onValidatePress: function (evt) {
				const amountOfBots = this.getView().byId("amountBots").getValue();
				const killerActivated = this.getView().byId("playWithKiller").getState();

				// TODO: BONUS
				// Check if wapen, dader, kamer are selected before going on.

				// FIXME: REQUIRED 3 
				// check onClick function for every room button
				// Get the selected item id for wapen, dader, kamer
				const answer = {
					"wapen": {
						"id": "" 
					},
					"dader": {
						"id": "" 
					},
					"kamer": {
						"id": "" 
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
						url: localBaseUrl + "/check_answer",
						type: "POST",
						cache: false,
						accept: "*/*",
						data: oData,
						contenttype: "application/json"
					}).then((oData, textstatus, jqXHR) => {
						this.getView().byId('wapenIcon').setVisible(true);
						this.getView().byId('daderIcon').setVisible(true);
						this.getView().byId('kamerIcon').setVisible(true);

						// PLAYER
						this._displayPlayerGuesses(oData);
						// FIXME: REQUIRED 4
						// If the player won, show _endOfGameDialog
						
						// KILLER
						// TODO: BONUS
						// Check if player died -> show _endOfGameDialog
						// Make Killer visible on screen


						// BOTS: 
						//TODO: BONUS
						// Add bots to playground & display bot guesses
						// Check if bot died by killer (if killer is active)
						// Check if bot won -> show _endOfGameDialog
						
					}).catch(() => {
						MessageToast.show(this.getView().getModel("i18n").getProperty("checkFailed"));
					});
				}
			},
			_endOfGameDialog: function (title, message) {
				// FIXME: REQUIRED 5
				// Show a dialog with restart button to inform the player.

				// TODO: BONUS
				// Maybe add something creative?
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
					this.getView().byId('wapenIcon').setVisible(true);
					this.getView().byId('wapenIcon').setProperty("color", "green");
					this.getView().byId('wapenIcon').setProperty("src", "sap-icon://accept");
				} else {
					this.getView().byId('wapenIcon').setVisible(true);
					this.getView().byId('wapenIcon').setProperty("color", "red");
					this.getView().byId('wapenIcon').setProperty("src", "sap-icon://decline");
				}
				if (playerData.checks.player.dader) {
					this.getView().byId('daderIcon').setVisible(true);
					this.getView().byId('daderIcon').setProperty("color", "green");
					this.getView().byId('daderIcon').setProperty("src", "sap-icon://accept");
				} else {
					this.getView().byId('daderIcon').setVisible(true);
					this.getView().byId('daderIcon').setProperty("color", "red");
					this.getView().byId('daderIcon').setProperty("src", "sap-icon://decline");
				}
				if (playerData.checks.player.kamer) {
					this.getView().byId('kamerIcon').setVisible(true);
					this.getView().byId('kamerIcon').setProperty("color", "green");
					this.getView().byId('kamerIcon').setProperty("src", "sap-icon://accept");
				} else {
					this.getView().byId('kamerIcon').setVisible(true);
					this.getView().byId('kamerIcon').setProperty("color", "red");
					this.getView().byId('kamerIcon').setProperty("src", "sap-icon://decline");
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
						this.getView().byId("bot" + botNr + "KamerIcon").setProperty("color", "green");
						this.getView().byId("bot" + botNr + "KamerIcon").setProperty("src", "sap-icon://accept");
					} else {
						this.getView().byId("bot" + botNr + "KamerIcon").setProperty("color", "red");
						this.getView().byId("bot" + botNr + "KamerIcon").setProperty("src", "sap-icon://decline");
					}
					if (botWapenValue) {
						this.getView().byId("bot" + botNr + "WapenIcon").setProperty("color", "green");
						this.getView().byId("bot" + botNr + "WapenIcon").setProperty("src", "sap-icon://accept");
					} else {
						this.getView().byId("bot" + botNr + "WapenIcon").setProperty("color", "red");
						this.getView().byId("bot" + botNr + "WapenIcon").setProperty("src", "sap-icon://decline");
					}
					if (botDaderValue) {
						this.getView().byId("bot" + botNr + "DaderIcon").setProperty("color", "green");
						this.getView().byId("bot" + botNr + "DaderIcon").setProperty("src", "sap-icon://accept");
					} else {
						this.getView().byId("bot" + botNr + "DaderIcon").setProperty("color", "red");
						this.getView().byId("bot" + botNr + "DaderIcon").setProperty("src", "sap-icon://decline");
					}
				}
			},

			onBalzaalPress: function () {
				// FIXME: REQUIRED 3.1
				// Set the correct room in dropdown
				const selected = [1, 0, 0, 0, 0, 0, 0, 0, 0];
				this._setKamerButtonSelected(selected);
			},

			onBibliotheekPress: function () {
				// FIXME: REQUIRED 3.2
				// Set the correct room in dropdown
				const selected = [1, 0, 0, 0, 0, 0, 0, 0, 0];
				this._setKamerButtonSelected(selected);
			},
			onBiljartkamerPress: function () {
				// FIXME: REQUIRED 3.3
				// Set the correct room in dropdown
				const selected = [0, 1, 0, 0, 0, 0, 0, 0, 0];
				this._setKamerButtonSelected(selected);
			},
			onEetkamerPress: function () {
				// FIXME: REQUIRED 3.4
				// Set the correct room in dropdown
				const selected = [0, 0, 1, 0, 0, 0, 0, 0, 0];
				this._setKamerButtonSelected(selected);
			},
			onHalPress: function () {
				// FIXME: REQUIRED 3.5
				// Set the correct room in dropdown
				const selected = [0, 0, 0, 1, 0, 0, 0, 0, 0];
				this._setKamerButtonSelected(selected);
			},
			onKeukenPress: function () {
				// FIXME: REQUIRED 3.6
				// Set the correct room in dropdown
				const selected = [, 0, 0, 0, 0, 1, 0, 0, 0];
				this._setKamerButtonSelected(selected);
			},
			onSerrePress: function () {
				// FIXME: REQUIRED 3.7
				// Set the correct room in dropdown
				const selected = [0, 0, 0, 0, 0, 0, 1, 0, 0];
				this._setKamerButtonSelected(selected);
			},
			onStudeerkamerPress: function () {
				// FIXME: REQUIRED 3.8
				// Set the correct room in dropdown
				const selected = [0, 0, 0, 0, 0, 0, 0, 1, 0];
				this._setKamerButtonSelected(selected);
			},
			onZitkamerPress: function () {
				// FIXME: REQUIRED 3.9
				// Set the correct room in dropdown
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
