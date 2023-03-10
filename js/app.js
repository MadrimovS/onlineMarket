import findElement from "./helpers/findElement.js";

export const BASE_URL = "https://63d79d2eafbba6b7c94093d4.mockapi.io/";
const elTemplate = findElement("#product-template");
const elCards = findElement(".product-cards");
const elSelect = findElement("#select");
const elSearch = findElement("#search");
const elLoader = findElement(".loaderBtn");

export let products = [];

////////////////////////// renderProducts ////////////////////
function renderProducts(array, parent = elCards) {
	parent.textContent = "";

	const fragment = document.createDocumentFragment();

	array.forEach((product) => {
		const template = elTemplate.content.cloneNode(true);

		const image = findElement(".product-image", template);
		const title = findElement(".product-title", template);
		const category = findElement(".product-category", template);
		const price = findElement(".product-price", template);
		const description = findElement(".product-description", template);
		const cardProduct = findElement(".productCard", template);

		cardProduct.dataset.id = product.id;

		cardProduct.addEventListener("click", targetCard(cardProduct));

		image.src = product.image;
		title.textContent = product.title;
		description.textContent = product.description;
		category.textContent = product.category;
		price.textContent = product.price + "$";

		fragment.appendChild(template);
	});

	parent.appendChild(fragment);
}

////////////////////////// asyncFunction /////////////////////
const asyncFunction = async function () {
	const res = await fetch(BASE_URL + "products/");

	let data = await res.json();

	products = data;

	for (let i = 0; i < products.length; i++) {
		const element = products[i];

		const elOption = document.createElement("option");
		elOption.textContent = element.category;

		elSelect.appendChild(elOption);
	}

	elLoader.style.display = "none";
	renderProducts(products);
};
asyncFunction();

///////////////////////// elSelect //////////////////////////
elSelect.addEventListener("change", (evt) => {
	const value = elSelect.value;

	const filteredPost = [];

	if (value == "All Products") {
		renderProducts(products);
	} else {
		products.forEach((product) => {
			if (value == product.category) {
				filteredPost.push(product);
			}
		});

		renderProducts(filteredPost);
	}
});

/////////////////////////// elSearch ////////////////////////
elSearch.addEventListener("input", (evt) => {
	evt.preventDefault();

	const searchProduct = [];

	const value = elSearch.value;

	products.forEach((product) => {
		if (product.title.toLowerCase().includes(value.toLowerCase())) {
			searchProduct.push(product);
		}
	});

	renderProducts(searchProduct);
});

///////////////////////// TARGET CARD //////////////////////
function targetCard(parent) {
	parent.addEventListener("click", () => {
		const id = parent.dataset.id;

		localStorage.setItem("id", id);
		window.location.href = "/singlePage.html";
	});
}
