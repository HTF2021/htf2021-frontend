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
			onInit: function () {
				$.ajax({
					url: "http://localhost:3000/data",
					type: "GET",
					cache: false,
					accept: "application/json"
				}).then((oData, textstatus, jqXHR) => {
					this.getView().setModel(new JSONModel(oData), 'cluedoModel');
					const grondplan = dataBaseUrl + this.getView().getModel('cluedoModel').getData().grondplannen[1].url;
					this.getView().byId("grondplanImg").setProperty("src", grondplan);

					const startImage = dataBaseUrl + this.getView().getModel('cluedoModel').getData().others[0].url;
					this.getView().byId("startImage").setProperty("src", startImage);
					this.getView().getModel('cluedoModel').setProperty("gameStarted", false);
				}).catch(() => {
					MessageToast.show(this.getView().getModel("i18n").getProperty("loadDataFailed"));
				});
			},
			_startNewGame: function () {
				$.ajax({
					url: "http://localhost:3000/new_solution",
					type: "GET",
					cache: false,
					accept: "application/json"
				}).then((oData, textstatus, jqXHR) => {
					MessageToast.show(this.getView().getModel("i18n").getProperty("newGame"));
				}).catch(() => {
					MessageToast.show(this.getView().getModel("i18n").getProperty("newGameFailed"));
				});
			},

			changeWapenImage: function(){
				const selectedItemText = this.getView().byId("wapen").getSelectedItem().getText();
				const selectedWapen = this.getView().getModel("cluedoModel").getData().wapens.filter((ele)=> ele.name === selectedItemText)[0];
				this.getView().byId("startImage").setProperty("src", dataBaseUrl + selectedWapen.url);
			},

			changeDaderImage: function(){
				
			},

			changeKamerImage: function(){
				
			},

			onStartPress: function () {
				var startButton = this.getView().byId("start");
				if (startButton.getText() === "Start") {
					startButton.setVisible(false);
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
					this.getView().byId("grondplanImg").setVisible(true);

					this.getView().byId("wapen").setVisible(true);
					this.getView().byId("dader").setVisible(true);
					this.getView().byId("kamer").setVisible(true);
					this.getView().byId("valideer").setVisible(true);
				} else {
					this.getView().byId("wapen").setValue(null);
					this.getView().byId("dader").setValue(null);
					this.getView().byId("kamer").setValue(null);

					this.getView().byId('daderIcon').setVisible(false);
					this.getView().byId('wapenIcon').setVisible(false);
					this.getView().byId('kamerIcon').setVisible(false);

					for(let botNr = 1; botNr <= 4; botNr++){
						this.getView().byId("bot" + botNr + "HBox").setVisible(false);
					}
				}
				this._startNewGame();
			},
			_parseBotStatuses(statuses){
				let parsedvalues = [];
				statuses.forEach(element => {
					parsedvalues.push((element === true))
				});
				return parsedvalues;
			},
			onValidatePress: function (evt) {
				BusyIndicator.show(0);
				const amountOfBots = this.getView().byId("amountBots").getValue();
				const killerActivated = this.getView().byId("playWithKiller").getState();
				const answer = {
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
						//Log eruit na testen
						botStatuses = this._parseBotStatuses(oData.statuses.bots);
						console.log(oData);
						console.log(oData.statuses.player);
						if(oData.statuses.player == false){
							var title = this.getView().getModel("i18n").getProperty("titleKillerKilledPlayer");
							var message = this.getView().getModel("i18n").getProperty("messageKillerKilledPlayer");
							this._endOfGameDialog(title, message);
						}

						if (amountOfBots > 0) {
							this._setBotOnBoard(oData);
							this._displayBotGuesses(oData);

							for(let botNr = 0; botNr < oData.checks.bots.length; botNr ++){
								if(oData.checks.bots[botNr].dader == true && oData.checks.bots[botNr].wapen == true && oData.checks.bots[botNr].kamer == true){
								const title = this.getView().getModel("i18n").getProperty("titleBotWon");
								const message = this.getView().getModel("i18n").getProperty("messageBotWon");
								this._endOfGameDialog(title, message);
								}
							}
							
						}

						if (oData.checks.player.dader === true && oData.checks.player.wapen === true && oData.checks.player.kamer === true) {
							const title = this.getView().getModel("i18n").getProperty("titlePlayerWon");
							const message = this.getView().getModel("i18n").getProperty("messagePlayerWon");

							this.getView().byId('wapenIcon').setProperty("src", "sap-icon://accept");
							this.getView().byId('kamerIcon').setProperty("src", "sap-icon://accept");
							this.getView().byId('daderIcon').setProperty("src", "sap-icon://accept");

							this._endOfGameDialog(title, message);
						} else {
							this._displayPlayerGuesses(oData);
						}
						BusyIndicator.hide();
					}).catch(() => {
						MessageToast.show(this.getView().getModel("i18n").getProperty("checkFailed"));
						BusyIndicator.hide();
					});
				}
			},
			_endOfGameDialog: function (title, message) {
				if (!this.oEscapePreventDialog) {
					this.oEscapePreventDialog = new Dialog({
						title: title,
						content: new Text({ text: message }),
						type: DialogType.Message,
						buttons: [
							new Button({
								text: this.getView().getModel("i18n").getProperty("playAgain"),
								press: function () {
									this.oEscapePreventDialog.close();
									this.onStartPress();
								}.bind(this)
							})
						]
					});
				}
				this.oEscapePreventDialog.open();
			},
			_setBotOnBoard: function (botData) {
				this._setButtonsEnabled();
				for (let i = 0; i < botData.botLocations.length; i++) {
					const botKamer = botData.botLocations[i]
					if(botKamer){
						this.getView().byId(botKamer.toLowerCase() + "Button").setType("Attention");
						this.getView().byId(botKamer.toLowerCase() + "Button").setEnabled(false);
					}
				}
			},
			_displayPlayerGuesses: function(playerData){
				if (playerData.checks.player.wapen) {
					this.getView().byId('wapenIcon').setProperty("src", "sap-icon://accept");
				} else {
					this.getView().byId('wapenIcon').setProperty("src", "sap-icon://decline");
				}
				if (playerData.checks.player.dader) {
					this.getView().byId('daderIcon').setProperty("src", "sap-icon://accept");
				} else {
					this.getView().byId('daderIcon').setProperty("src", "sap-icon://decline");
				}
				if (playerData.checks.player.kamer) {
					this.getView().byId('kamerIcon').setProperty("src", "sap-icon://accept");
				} else {
					this.getView().byId('kamerIcon').setProperty("src", "sap-icon://decline");
				}
			},
			_displayBotGuesses: function(botData) {
				for (let i = 0; i < botData.checks.bots.length; i++) {
					const botKamerValue = botData.checks.bots[i].kamer;
					const botWapenValue = botData.checks.bots[i].wapen;
					const botDaderValue = botData.checks.bots[i].dader;

					let botNr = i + 1;
					this.getView().byId("bot" + botNr + "HBox").setVisible(true);
					if (botKamerValue) {
						this.getView().byId("bot" + botNr + "KamerIcon").setProperty("src", "sap-icon://accept");
					} else {
						this.getView().byId("bot" + botNr + "KamerIcon").setProperty("src", "sap-icon://decline");
					}
					if (botWapenValue) {
						this.getView().byId("bot" + botNr + "WapenIcon").setProperty("src", "sap-icon://accept");
					} else {
						this.getView().byId("bot" + botNr + "WapenIcon").setProperty("src", "sap-icon://decline");
					}
					if (botDaderValue) {
						this.getView().byId("bot" + botNr + "DaderIcon").setProperty("src", "sap-icon://accept");
					} else {
						this.getView().byId("bot" + botNr + "DaderIcon").setProperty("src", "sap-icon://decline");
					}
				}
			},
			_setButtonsEnabled: function () {
				this.getView().byId("balzaalButton").setEnabled(true);
				this.getView().byId("bibliotheekButton").setEnabled(true);
				this.getView().byId("biljartkamerButton").setEnabled(true);
				this.getView().byId("eetkamerButton").setEnabled(true);
				this.getView().byId("halButton").setEnabled(true);
				this.getView().byId("keukenButton").setEnabled(true);
				this.getView().byId("serreButton").setEnabled(true);
				this.getView().byId("studeerkamerButton").setEnabled(true);
				this.getView().byId("zitkamerButton").setEnabled(true);
			},
			onBalzaalPress: function () {
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
