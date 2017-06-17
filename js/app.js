
var initialCats = [
	{
		name : 'Tabby',
	},
	{
		name : 'Tiger',
	},
	{
		name : 'Black',
	},
	{
		name : 'White',
	},
	{
		name : 'Fan',
	},
];

var Cat = function(data) {
	this.name = ko.observable(data.name);
	this.isVisible = ko.observable(true);
}

var ViewModel = function() {
	var self = this;

	this.searchValue = ko.observable();

	this.isToggled = ko.observable(false);

	this.toggleSideBar = function() {
		this.isToggled(!this.isToggled());
	};

	this.catList = ko.observableArray([]);

	initialCats.forEach(function(catItem) {
		self.catList.push (new Cat(catItem));
	});


	this.autoCompelete = ko.computed(function() {
		this.reg = new RegExp(this.searchValue(),"i");
		for(var cat in this.catList()){
			if(!this.reg.test(this.catList()[cat].name()))
			{
				this.catList()[cat].isVisible(false);
			}
			else
			{
				this.catList()[cat].isVisible(true);
			}
		}

		//resort the array
		this.catList.sort(function(a,b){
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