export class ShoppingCart {
	#items;

	constructor() {
		this.#items = this.#load();
	}

	getItems() {
		return ([...this.#items]);
	}

	addItem(item) {
		const index = this.#items.findIndex(i => i.id === item.id);

		if (index == -1) {
			item.quantidade = 1;
			this.#items.push(item);
		} else
			this.#items[index].quantidade++;

		this.#save();
	}

	removeItem(item) {
		const index = this.#items.findIndex(i => i.id === item.id);

		if (index > -1)
			this.#items.splice(index, 1);

		this.#save();
	}

	clear() {
		this.#items = [];

		this.#save();
	}

	getSubtotal() {
		let subtotal = 0;

		this.#items.forEach(item => {
			subtotal += item.preco;
		});

		return (subtotal);
	}

	#load() {
		const data = localStorage.getItem("shoppingCart");

		if (!data) {
			localStorage.setItem("shoppingCart", JSON.stringify([]));
			return ([]);
		}

		return (JSON.parse(data));
	}

	#save() {
		localStorage.setItem("shoppingCart", JSON.stringify(this.#items));
	}
}
