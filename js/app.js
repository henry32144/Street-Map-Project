var stores = ko.observableArray([]);

var saveStoreList = function(place) {
	stores(place);
}

var createStoreList = function(place , index) {
	this.name = ko.observable(place.name);
	this.isVisible = ko.observable(true);
	this.index = index;
}


var ViewModel = function() {
	var self = this;

	this.searchValue = ko.observable();

	//Set sidebar toggle 
 	this.isToggled = ko.observable(false);

	this.toggleSideBar = function() {
		this.isToggled(!this.isToggled());
	};

	//unavailable text filter
	this.clearString = function(s){ 
	    var pattern = new RegExp("[`\\\\~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）&;|{}【】‘；：”“'。，、？]") 
	    var rs = ""; 
	    for (var i = 0; i < s.length; i++) { 
	        rs = rs+s.substr(i, 1).replace(pattern, ''); 
	    } 
	    return rs;  
	}

	this.storeList = ko.observableArray([]);

	this.refreshStoreList = ko.computed(function() {
		stores().forEach(function(storeItem , index) {
		self.storeList.push(new createStoreList(storeItem , index));
		});
	},this);
	
	this.autoCompelete = ko.computed(function() {
			temp = this.searchValue();
			if(!temp) {
				temp = "";
			}
			tempVal = self.clearString(temp);
			this.reg = new RegExp(tempVal,"i");
			for(var s in this.storeList()){
				if(!this.reg.test(this.storeList()[s].name()))
				{
					this.storeList()[s].isVisible(false);
					if(markersReady) {
						hideMarker(this.storeList()[s].index);
					}
				}
				else
				{
					this.storeList()[s].isVisible(true);
					if(markersReady) {
						showMarker(this.storeList()[s].index);
					}
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

	this.openMarker = function(store) {
		tempMarker = markers[store.index];
		openInfo(tempMarker,store.index);
	};

	
}


ko.applyBindings(new ViewModel());


