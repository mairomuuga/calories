// Storage Controller
const StorageCtrl = (function(){
	// public methods
	return {
		storeItem: function(item){
			let items;
			// check if any items in ls
			if(localStorage.getItem('items') === null){
				items = [];
				// push new item
				items.push(item);
				// set ls
				localStorage.setItem('items', JSON.stringify(items));
			} else {
				// get what already in ls
				items = JSON.parse(localStorage.getItem('items'));
				// push new item
				items.push(item);
				// reset ls
				localStorage.setItem('items', JSON.stringify(items));
			}
		},
		getItemsFromStorage: function(){
			let items;
			if(localStorage.getItem('items')=== null){
				items = [];
			} else {
				items = JSON.parse(localStorage.getItem('items'));
			}
			return items;
		}
	}
})();

// Item Controller
const ItemCtrl = (function(){
	// Item Constructor
	const Item = function(id, name, calories){
		this.id = id
		this.name = name
		this.calories = calories
	}

	// Data Structure
	const data = {
		items: [
			//{id: 0, name: 'Steak Dinner', calories: 1200},
			//{id: 1, name: 'Cookie', calories: 400},
			//{id: 2, name: 'Eggs', calories: 300},
		],
		total: 0
	}

	return {
		getItems: function(){
			return data.items
		},
		addItem: function(name, calories){
			let id;
			// create id
			if(data.items.length > 0){
				id = data.items[data.items.length - 1].id + 1
			} else {
				id = 0
			}
			// parse calories to int
			calories = parseInt(calories)
			// create new item
			newItem = new Item(id, name, calories)
			// add item to data items
			data.items.push(newItem)
			return newItem
		},
		getTotalCalories: function(){
			let total = 0;
			// loop through items and add calories
			data.items.forEach(function(item){
				total = total + item.calories;
			});
			// set total calories in data structure
			data.total = total;
			// return total
			return data.total;
		},
		logData: function(){
			return data
		}
	}
})();


// UI Controller
const UICtrl = (function(){
	// UI selectors
	const UISelectors = {
		itemList: '#item-list',
		itemNameInput: '#item-name',
		itemCaloriesInput: '#item-calories',
		addBtn: '.add-btn',
		totalCalories: '.total-calories'
	}

	return {
		populateItemList: function(items){
			// create html content
			let html = '';

			// parse data and create list items html
			items.forEach(function(item){
				html += `<li class="collection-item" id="item-${item.id}">
				<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
				<a href="#" class="secondary-content">
					<i class="edit-item fa fa-pencil"></i>
				</a>
				</li>`;
			});

			// insert list items
			document.querySelector(UISelectors.itemList).innerHTML = html;
		},
		getItemInput: function(){
			return {
				name: document.querySelector(UISelectors.itemNameInput).value,
				calories: document.querySelector(UISelectors.itemCaloriesInput).value
			}
		},
		getSelectors: function(){
			return UISelectors
		},
		addListItem: function(item){
			// create li element
			const li = document.createElement('li');
			// add class
			li.className = 'collection-item';
			// add ID
			li.id = `item-${item.id}`;
			// add HTML
			li.innerHTML = `<strong>${item.name}: </strong> 
				<em>${item.calories} Calories</em>
				<a href="#" class="secondary-content">
					<i class="edit-item fa fa-pencil"></i>
				</a>`;
			// insert item
			document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li)
		},
		clearInput: function(){
			document.querySelector(UISelectors.itemNameInput).value = '';
			document.querySelector(UISelectors.itemCaloriesInput).value = '';
		},
		showTotalCalories: function(totalCalories){
			document.querySelector(UISelectors.totalCalories).
				textContent = totalCalories;
		}
	}
})();

// App Controller
const App = (function(ItemCtrl, StorageCtrl, UICtrl){
	// load event listeners
	const loadEventListeners = function(){
		// get UI selectors
		const UISelectors = UICtrl.getSelectors()
		// add item event
		document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit)
		// add document reload event
		document.addEventListener('DOMContentLoaded', getItemsFromStorage)
	}
	// add item submit
	const itemAddSubmit = function(event){
		// get form input from UI controller
		const input = UICtrl.getItemInput()
		// check name and calorie input
		if(input.name !== '' && input.calories !== ''){
			const newItem = ItemCtrl.addItem(input.name, input.calories)
			// add item to UI items
			UICtrl.addListItem(newItem)
			//get total calories
			const totalCalories = ItemCtrl.getTotalCalories();
			// add total calories to UI
			UICtrl.showTotalCalories(totalCalories);
			// store in localStorage
			StorageCtrl.storeItem(newItem);
			// clear fields
			UICtrl.clearInput();
		}
		event.preventDefault()
	}
	// get items from storage
	const getItemsFromStorage = function(){
		// get items from storage
		const items = StorageCtrl.getItemsFromStorage()
		// set storage items to ItemCtrl data items
		items.forEach(function(item){
			ItemCtrl.addItem(item['name'], item['calories'])
		})
		// get total calories
		const totalCalories = ItemCtrl.getTotalCalories();
		// add total calories to UI
		UICtrl.showTotalCalories(totalCalories);
		// populate items list
		UICtrl.populateItemList(items)
	}
	return {
		init: function(){
			console.log('Initializing App')
			// fetch items from data structure
			const items = ItemCtrl.getItems()
			// populate items list
			UICtrl.populateItemList(items)
			// load event listener
			loadEventListeners()
		}
	}
})(ItemCtrl, StorageCtrl ,UICtrl);

App.init()