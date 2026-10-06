import { produtos, categorias as tags } from "./produtos.js";
import { ShoppingCart } from "./ShoppingCart.js";

const articleGrid = document.getElementById("article-grid");
const filters = document.getElementById("filters");
const themeToggle = document.getElementById("theme-toggle");

const cart = new ShoppingCart();

let selectedTag = "all";

document.addEventListener("DOMContentLoaded", () => {
	fillProductGrid();
	setupFilters();
	setupTheme();
	fillOrder();
});

function fillProductGrid() {
	produtos.forEach((product) => {
		articleGrid.append(createProductCard(product));
	});
}

function fillOrder() {
	const cartItems = document.getElementById("cart-items");
	cartItems.innerHTML = "";

	const savedItems = cart.getItems();

	if (savedItems.length == 0) {
		cartItems.innerHTML = `
			<div id="empty-cart">
				<p>
					Seu carrinho está vazio.
				</p>
				<p>
					Adicione produtos do cardápio para começar.
				</p>
			</div>
		`;
	}
	else {
		savedItems.forEach((item) => {
			const newItem = document.createElement("div");

			newItem.innerHTML = `
				<div class="order-item">
					<p>Produto: ${item.nome}</p> <span>Quantidade: ${item.quantidade}</span>
				</div>
			`;

			cartItems.appendChild(newItem);
		});
	}
}

function createProductCard(data) {
	const newProductCard = document.createElement("article");

	newProductCard.classList.add("article-card");
	newProductCard.dataset.category = data.categoria;
	newProductCard.innerHTML = `
		<img class="article-card__img" src="${data.img_url}" alt="${data.img_alt}">
		<p class="article-card__title">${data.nome}</h2>
		<p class="article-card__tag tag tag-${getTagSymbol(data.categoria)}">${getTagName(data.categoria)}</p>
		<div class="article-card__rating">
			<span class="article-card__rating--active">${"*".repeat(data.avaliacao)}</span><span class="article-card__rating--inactive">${"*".repeat(5 - data.avaliacao)}</span> ${data.avaliacao}</div>
		<p class="article-card__price">R$ ${data.preco.toFixed(2)}</p>
		<button class="article-card__button">Adicionar</button>
	`;

	const button = newProductCard.querySelector(".article-card__button");
	button.addEventListener("click", () => {
		cart.addItem(data);
		fillOrder();
	});

	return (newProductCard);
}

function getTagName(tagNumber) {
	return (tags[tagNumber].printName);
}

function getTagSymbol(tagNumber) {
	return (tags[tagNumber].symbolName);
}

function setupFilters() {
	filters.addEventListener("click", (event) => {
		const button = event.target.closest(".filters-tag");

		if (!button)
			return;

		selectedTag = button.dataset.category;

		updateFilterAppearence();
		filterArticles();
	});
}

function updateFilterAppearence() {
	const buttons = filters.querySelectorAll(".filters-tag");

	buttons.forEach((button) => {
		const isActive = button.dataset.category === selectedTag;

		button.classList.toggle("is-active", isActive);
		button.setAttribute("aria-pressed", isActive);
	});
}

function filterArticles() {
	const cards = articleGrid.querySelectorAll(".article-card");

	cards.forEach((card) => {
		const doesMatchCategory = (selectedTag === "all"
			|| card.dataset.category === selectedTag);

		card.hidden = !doesMatchCategory;
	});
}

function setupTheme() {
	const savedTheme = localStorage.getItem("theme");

	const initialTheme = savedTheme ?? "light";

	setTheme(initialTheme);

	themeToggle.addEventListener("click", toggleTheme)
}

function setTheme(theme) {
	document.documentElement.dataset.theme = theme;

	const isDark = (theme === "dark");

	themeToggle.setAttribute("aria-label", isDark ? "Ativar tema claro" : "Ativar tema escuro");
	themeToggle.style.backgroundImage = `url(../img/${isDark ? "light" : "dark"}_mode.svg)`;
}

function toggleTheme() {
	const currentTheme = document.documentElement.dataset.theme;
	const newTheme = (currentTheme === "dark") ? "light" : "dark";

	setTheme(newTheme);

	localStorage.setItem("theme", newTheme);
}
