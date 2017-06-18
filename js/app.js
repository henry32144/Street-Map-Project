var stores = ko.observableArray([]);

var saveStoreList = function(place) {
	stores(place);
}

var createStoreList = function(place) {
	console.log(place.name);
	this.name = ko.observable(place.name);
	this.isVisible = ko.observable(true);
}

var Cat = function(data) {
	this.name = ko.observable(data.name);
	this.isVisible = ko.observable(true);
}

var ViewModel = function() {
	var self = this;

	this.searchValue = ko.observable();

	//Set sidebar toggle 
 	this.isToggled = ko.observable(false);

	this.toggleSideBar = function() {
		this.isToggled(!this.isToggled());
	};

	this.storeList = ko.observableArray([]);

	this.refreshStoreList = ko.computed(function() {
		stores().forEach(function(storeItem) {
		self.storeList.push (new createStoreList(storeItem));
		});
	},this);
	



	this.autoCompelete = ko.computed(function() {
		this.reg = new RegExp(this.searchValue(),"i");
		for(var s in this.storeList()){
			if(!this.reg.test(this.storeList()[s].name()))
			{
				this.storeList()[s].isVisible(false);
			}
			else
			{
				this.storeList()[s].isVisible(true);
			}
		}

		//resort the array
		this.storeList.sort(function(a,b){
			if(a.isVisible() > b.isVisible()) {
				return -1;
			}
			if(a.isVisible() < b.isVisible()) {
				return 1;
			}			
			return 0;
		});


	},this);

	

}

ko.applyBindings(new ViewModel());