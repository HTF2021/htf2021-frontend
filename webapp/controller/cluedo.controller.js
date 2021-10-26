sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast",
	"sap/ui/model/json/JSONModel"
],
	/**
	 * @param {typeof sap.ui.core.mvc.Controller} Controller
	 */
	function (Controller, MessageToast, JSONModel) {
		"use strict";

		return Controller.extend("com.flexso.htf2021.controller.cluedo", {
			
			onInit: function () {
				$.ajax({
					url: "http://localhost:3000/data",
					type: "GET",
					cache: false,
					accept: "application/json"
				}).then((oData, textstatus, jqXHR)=>{
					this.getView().setModel(new JSONModel(oData), 'cluedoModel');
					let grondplan = "https://htf-2021.herokuapp.com" + this.getView().getModel('cluedoModel').getData().grondplannen[1].url;
					this.getView().byId("grondplanImg").setProperty("src", grondplan);
				}).catch(()=>{
					MessageToast.show("Could not load game data.");
				});
			},
			_startNewGame: function(){
				$.ajax({
					url: "http://localhost:3000/new_solution",
					type: "GET",
					cache: false,
					accept: "application/json"
				}).then((oData, textstatus, jqXHR)=>{
					console.log(oData); // Log answer (testing)
					// TODO: Start new game (visible / hidden, enable / disable)?
					MessageToast.show("New game started!");
				}).catch(()=>{
					MessageToast.show("Could not start new game.");
				});
			},
	
			onStartPress: function (evt) {
				var startButton = this.getView().byId("start");
				if (startButton.getText() == "Start") {
					startButton.setText("Restart");
					startButton.setIcon("sap-icon://restart");
					startButton.setType("Reject");

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
				} else {
					startButton.setText("Start");
					startButton.setIcon("sap-icon://begin");
					startButton.setType("Accept");
				}
	
				this._startNewGame();
				
			},
			onValidatePress: function (evt) {
				// TODO: Get data from model
				var answer = {
					"wapen": {
						"id": this.getView().byId("wapen").getSelectedKey()
					},
					"dader": {
						"id": this.getView().byId("dader").getSelectedKey()
					},
					"kamer": {
						"id": this.getView().byId("kamer").getSelectedKey()
					}
				}
				console.log(answer);
				if(answer != undefined){// TODO: Check data is filled in
					$.ajax({
						url: "http://localhost:3000/check_answer",
						type: "POST",
						cache: false,
						accept: "application/json",
						data: answer
					}).then((oData, textstatus, jqXHR)=>{
						console.log(oData); // Log answer (testing)
						if(oData.wapen){
							// TO TEST: Set wapen guess correct
							//this.getView().ById('wapenIcon').setProperty("src", "sap-icon://accept");
						} else {
							//this.getView().ById('wapenIcon').setProperty("src", "sap-icon://decline");
						}
						if(oData.dader){
							// TO TEST: Set dader guess correct
							//this.getView().ById('daderIcon').setProperty("src", "sap-icon://accept");
						} else {
							//this.getView().ById('daderIcon').setProperty("src", "sap-icon://decline");
						}
						if(oData.kamer){
							// TO TEST: Set kamer guess correct
							//this.getView().ById('kamerIcon').setProperty("src", "sap-icon://accept");
						} else {
							//this.getView().ById('kamerIcon').setProperty("src", "sap-icon://decline");
						}
					}).catch(()=>{
						MessageToast.show("Could check the answer. Please try again.");
					});
				}
			},
			// TODO: On kamer select: select corresponding kamer in dropdown 
			onBalzaalPress: function (evt) {
				MessageToast.show(evt.getSource().getId() + " Pressed");
			},
			onBibliotheekPress: function (evt) {
				MessageToast.show(evt.getSource().getId() + " Pressed");
			},
			onBiljartkamerPress: function (evt) {
				MessageToast.show(evt.getSource().getId() + " Pressed");
			},
			onEetkamerPress: function (evt) {
				MessageToast.show(evt.getSource().getId() + " Pressed");
			},
			onHalPress: function (evt) {
				MessageToast.show(evt.getSource().getId() + " Pressed");
			},
			onKeukenPress: function (evt) {
				MessageToast.show(evt.getSource().getId() + " Pressed");
			},
			onSerrePress: function (evt) {
				MessageToast.show(evt.getSource().getId() + " Pressed");
			},
			onStudeerkamerPress: function (evt) {
				MessageToast.show(evt.getSource().getId() + " Pressed");
			},
			onZitkamerPress: function (evt) {
				MessageToast.show(evt.getSource().getId() + " Pressed");
			}
		});
	});
