import { hero, box } from "./date.js";

const model_1 = document.querySelector(".about");
const model = document.querySelector(".box");
const title = document.querySelector(".title_price");

const cartEl = document.querySelector(".muhammadAli");

model_1.innerHTML = hero.map(
  (item) =>
    `
    <div>
        <p class= "text-[#fb2e86]  leading-[175%] text-[16px] font-bold mb-[12px]">${item.text}</p>
        <h2 class="font-bold text-[53px] text-[#000]">${item.h2}</h2>
        <p class="font-bold text-[16px] leading-[175%] text-[#8a8fb9] mt-[12px]">$${item.p}</p>
    </div>
     
    <div> 
         <img src="${item.img}"/>
    </div>
    `
);

const loadState = (key) => {
  const data = localStorage.getItem(key);
  if (data) {
    return JSON.parse(data);
  }
  return;
};

const saveState = (key, data) => {
  if (data) {
    localStorage.setItem(key, JSON.stringify(data));
  }
};

const totalPrice = () => {
  const data = loadState("products");
  if (data) {
    title.innerHTML = data.reduce((a, b) => a + b.user_price, 0) + " $";
  }
};

const renderCart = () => {
  const data = loadState("products");

  cartEl.innerHTML = data?.map(
    (items) => `
        <div class=" bg-[#fff] shadow-xl p-10 w-[270px] ">
             <img class= "justify-center " src="${items.img}"/>
             <h3 class="font-bold mt-[27px] text-[18px] text-[#fb2e86] text-center">${
               items.h3
             }</h3>
             <img class= "ml-auto mr-auto mt-[12px]" src="${items.img_1}"/>
             <h3 class="font-medium mb-[12px] mt-[27px] text-[14px] text-[#151875] text-center">${
               items.text
             }</h3>
             <strong class="font-normal text-[14px] text-[#151875] block text-center">$ ${
               items.user_price
             }</strong>
            <div>
             <button data-increment="${
               items.id
             }" class="p-2 bg-gray-400">+</button>
             <span>${items.user_count}</span>
             ${
               items.user_count > 1
                 ? `<button data-decrement="${items.id}" class="p-2 bg-gray-400">-</button>`
                 : `<button data-delete="${items.id}" class="p-2 bg-gray-400">X</button>`
             }
             
            </div>
        </div>
    `
  );
  totalPrice();
};

renderCart();

const delettedItem = (id) => {
  const data = loadState("products");
  const newData = data.filter((item) => item.id != id);
  saveState("products", newData);

  renderCart();
};

cartEl.addEventListener("click", (e) => {
  const inc = e.target.dataset.increment;
  const dec = e.target.dataset.decrement;
  const del = e.target.dataset.delete;
  const products = loadState("products");
  if (del) {
    delettedItem(del);
  }
  if (inc || dec) {
    const newData = products.map((item) => {
      if (inc == item.id) {
        return {
          ...item,
          user_count: item.user_count + 1,
          user_price: item.strong * (item.user_count + 1),
        };
      }
      if (dec == item.id && item.user_count > 0) {
        return {
          ...item,
          user_count: item.user_count - 1,
          user_price: item.strong * (item.user_count - 1),
        };
      }
      return item;
    });

    saveState("products", newData);

    renderCart();
  }
});

model.addEventListener("click", (e) => {
  const id = e.target.dataset.id;
  if (id) {
    const product = box.find((item) => item.id === Number(id));
    const oldData = loadState("products");
    if (oldData) {
      const oldProduct = oldData.find((item) => item.id === Number(id));
      if (!oldProduct) {
        saveState("products", [
          ...oldData,
          { ...product, user_price: product.strong, user_count: 1 },
        ]);
      }
    } else {
      saveState("products", [
        { ...product, user_price: product.strong, user_count: 1 },
      ]);
    }
  }

  renderCart();
});

model.innerHTML = box
  .map(
    (items) =>
      `
        <div class=" bg-[#fff] shadow-xl p-10 w-[270px] ">
             <img class= "justify-center " src="${items.img}"/>
             <h3 class="font-bold mt-[27px] text-[18px] text-[#fb2e86] text-center">${items.h3}</h3>
             <img class= "ml-auto mr-auto mt-[12px]" src="${items.img_1}"/>
             <h3 class="font-medium mb-[12px] mt-[27px] text-[14px] text-[#151875] text-center">${items.text}</h3>
             <strong class="font-normal text-[14px] text-[#151875] block text-center">$ ${items.strong}</strong>
             <button data-id="${items.id}" class="bg-green-400 ">BUY</button>
        </div>
    `
  )
  .join("");
