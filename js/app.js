
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
}

var ViewModel = function() {
	var self = this;

	isToggled = ko.observable(false);

	this.toggleSideBar = function() {
		isToggled(!isToggled());
	}

	this.catList = ko.observableArray([]);

	initialCats.forEach(function(catItem) {
		self.catList.push (new Cat(catItem));
	});

	this.currentCat = ko.observable(this.catList()[0]);

}

ko.applyBindings(new ViewModel());