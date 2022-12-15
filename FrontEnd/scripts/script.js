import { API_URL, sessionSaveProducts } from "./exports.js";

async function loadPopularProducts() {
  // api endpoint
  const popularProducts = await fetch(API_URL + "/products/popular", {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json"
    },
    // avoid cors errors
    mode: "cors",
  }).then(res => res.json()).then(value => value.products).catch(e => {
    console.error(e);
    // retry after 5 secs if an error occured
    setTimeout(() => {
      loadPopularProducts();
    }, 5000);
  });

  if (!popularProducts) return;
  // the popular products on the landing page
  const products = document.querySelectorAll(".popular-products");

  for (let i = 0; i < products.length; i++) {
    // destructure the children the alter their props
    const [img, body] = products[i].children;
    // set the product image
    img.src = popularProducts[i].thumbnail;
    const [name, , end] = body.children;
    // product name
    name.textContent = popularProducts[i].make;
    const [price, link] = end.children;
    // product price
    price.textContent = `$${popularProducts[i].retailPrice}`
    // product link
    link.href = `/pages/productDetails.html?id=${popularProducts[i].styleID}`
  }

  sessionSaveProducts(popularProducts);
}
loadPopularProducts();


// search button redirects to product list page
const landingPageSearchBtn = document.getElementById("landing-page-search-btn");

landingPageSearchBtn.onclick = () => {
  const query = document.getElementById("landing-page-search").value;
  if (!query) return;

  const reqQuery = encodeURI(query);

  location.href = `${location.pathname}pages/list.html?q=${reqQuery}`;
};


// incase the backend has spun down due to being on the free tier

async function SpinUpBackend() {
  await fetch(API_URL, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json"
    },
    // avoid cors errors
    mode: "cors",
  })
}

SpinUpBackend();