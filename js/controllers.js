/*
By veysel Diyenli
12/10/2016
*/


(function(){
	"use strict";

	/*create a module for the app*/
	var myApp = angular.module("GrabbleApp",["ngRoute", "toggle-switch"]);
	
	
	/* ROUTES */
	
	/*set up the route navigation for the spa pages (just wanted to demonstrate i can use route for spa style apps)*/
	myApp.config(function($routeProvider){
		$routeProvider
			.when("/",{
				controller: 	"grabbleContentEdit",
				templateUrl: 	"partials/contentEditor.html"
			})
			.otherwise({
				redirectTo:"/"
			});
	});
	
	/* FACTORIES */
	myApp.factory("dataApi", function(){

		var contentData = [];
		var productsAPI = [{
			  "id": 167687,
			  "title": "A Kind of Guise Mindelo T-Shirt (White)",
			  "price": "80.00",
			  "retailer": "Oipolloi",
			  "image": "https://static.grabble.com/products/167687/149509c8ea32f07ab0027064b9b2b7ce.jpg"
			}, {
			  "id": 167790,
			  "title": "Linen-Cotton crew pullover",
			  "price": "29.95",
			  "retailer": "Gap",
			  "image": "https://static.grabble.com/products/167790/dba4bd52b9764818c780fb4e471fa741.jpg"
			}, {
			  "id": 168012,
			  "title": "ASOS Skinny Blazer In Cotton",
			  "price": "65.00",
			  "retailer": "ASOS",
			  "image": "https://static.grabble.com/products/168012/324927f3437e024b7301bdc05c542c28.jpg"
			}, {
			  "id": 168013,
			  "title": "Julep Printed Crew Neck Jumper",
			  "price": "50.00",
			  "retailer": "French Connection",
			  "image": "https://static.grabble.com/products/168013/c1385ee4ba25e9c67cbade7071a9670c.jpg"
			}];
		
		var factoryObj = {}
		/* re-useable factory functions */
		
		/*get data into the controllers*/
		factoryObj.getContentData = function(){
			return contentData;
		}
		
		/*get products into the controllers*/
		factoryObj.getProducts = function(){
			return productsAPI;
		}		
		
		/*add default content in to the array*/
		factoryObj.addContentBlockToContentData = function(type){
			if (type =="text"){
				contentData.push({'id': Math.floor(Math.random() * 20),
					'type': 'text',
					'title': 'Title',
					'body': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed suscipit tellus ipsum, in dapibus ipsum 			    						 pulvinar eget. Ut efficitur enim sed justo convallis cursus.'
				});
			}
			else if(type =="products"){ 
				contentData.push({'id': Math.floor(Math.random() * 20),
					'type': 'products',
					'products': []});
			}
			else{
				console.error("Content Block type not defined correctly. type is:" + type);
			}
		}	

		/*delete content from the array*/
		factoryObj.deleteContentDataFromContentData = function(id){ 
			var i;
			
			for(i =0; i < contentData.length; i++){
				if (contentData[i].id == id){
						contentData.splice( i, 1 );
						break;
				}else if(i > contentData.length){
					console.error("Selected content block does not exist. id is:" + id);
				}
			}
		}	
		
		/*update the data aray with the new json object returned from the controller*/
		factoryObj.updateData = function(jsonObj){
			contentData = jsonObj;
			/*in a real world scinario i will write an HTTP request to connect to a api to update the database*/
		}

		return factoryObj;
	});
	
	
	/* CONTROLLERS */
	myApp.controller("grabbleContentEdit", function($scope, dataApi){
		
		$scope.editMode = true;
		$scope.saveReady = false;
		$scope.viewJson = false;
		$scope.jsaonString ="";
		
		/*content array*/
		$scope.dataIs = dataApi.getContentData();
		
		/*products array*/
		$scope.productsIs = dataApi.getProducts();
				
		/*add Content according to the type*/
		$scope.addContentBlock = function(type){
			dataApi.addContentBlockToContentData(type);
		}
		
		/*delete Content according to the type*/
		$scope.DeleteContentBlock = function(id){
			dataApi.deleteContentDataFromContentData(id);	
		}	
		
		/*check to see if the json is change and save is required*/
		$scope.$watch("dataIs",function(){
			if($scope.dataIs.length != 0){
				$scope.saveReady = true;
				$scope.viewJson = true;
				$scope.jsaonString = JSON.stringify($scope.dataIs);
			}else{
				$scope.saveReady = false;
				$scope.viewJson = false;
			}	
		},true);

		/*save content into the factory*/
		$scope.saveContent = function(jsonObj){

			dataApi.updateData(jsonObj);
			$scope.saveReady = false;
			
		}
	});
	
	
	/* CUSTOM DIRECTIVES */
	myApp.directive("textComponent", function(){
		return{
			restrict: 'E',
			templateUrl: 'directives/textComponent.html',
			scope: {
				id: "=",
				title: "=",
				body: "=",
				edit: "="
			}
		}
	});
	
	myApp.directive("productsComponent", function(){
		return{
			restrict: 'E',
			templateUrl: 'directives/productsComponent.html',
			scope: {
				id: "=",
				products: "=",
				productsinfo: "=",
				edit:"="
			},
			controller: function($scope){
				
				$scope.displayarray =[];

				$scope.addProduct = function(id){
					$scope.products.push(id);
					var i;
					for(i =0; i < $scope.productsinfo.length; i++){
						if ($scope.productsinfo[i].id == id){
							$scope.displayarray.push($scope.productsinfo[i]);
							$scope.productsinfo.splice(i, 1);
							break;
						}
					}
				}
				
				$scope.removeProduct = function(id){
					var i;
					for(i =0; i < $scope.displayarray.length; i++){
						if ($scope.displayarray[i].id == id){
							$scope.productsinfo.push($scope.displayarray[i]);
							$scope.displayarray.splice(i, 1);
							break;
						}
					}
					
					for(i =0; i < $scope.products.length; i++){
						if ($scope.products[i] == id){
							$scope.products.splice(i, 1);
							break;
						}
					}					
				}				
			}
		}
	});	

	
})();


























