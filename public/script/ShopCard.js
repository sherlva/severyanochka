window.addEventListener("load", function (e) {
  const productItemFormMinus = document.querySelectorAll(
    ".cards_card_count_p span button.minus"
  );
  const productItemFormPlus = document.querySelectorAll(
    ".cards_card_count_p span button.plus"
  );
  const productItemFormCount = document.querySelectorAll(
    ".cards_card_count_p span .product_count"
  );
  const order_cards_left = document.querySelector(".order_cards_left");
  const cartCountNav = document.querySelector(".user_btns_link_count");
  const cartCountTitle = document.querySelector(".title_page span");

  const total_price = document.querySelector(".total_price");

  function fetchCount(productid, mode) {
    return new Promise((resolve, reject) => {
      fetch(`/shopping/upload/${productid}/${mode}`, {
        method: "POST",
        headers: { "Content-type": "application/json" },
      })
        .then((res) => res.json())
        .then((res) => resolve(res))
        .catch((err) => reject(err));
    });
  }

  function getTotalPrice() {
    const product_price = document.querySelectorAll(".totalprice_product");

    product_price.forEach((item) => {
      item.innerHTML =
        item.getAttribute("data-price") * item.getAttribute("data-count");
    });
  }
  getTotalPrice();

  productItemFormMinus.forEach((minus, index) => {
    minus.addEventListener("click", () => {
      const productid = minus.getAttribute("data-productid");
      minus.disabled = true;
      fetchCount(productid, "minus")
        .then((res) => {
          console.log(res);
          const countPrice =
            minus.parentElement.parentElement.parentElement.parentElement
              .childNodes[3].childNodes[1].childNodes[1];
          countPrice.innerHTML =
            countPrice.getAttribute("data-price") * res.data.count;
          if (res.isDeleted) {
            minus.parentElement.parentElement.parentElement.parentElement.parentElement.remove();
          } else {
            productItemFormCount[index].innerHTML = res.data.count;
          }

          total_price.innerHTML = res.data.price + " ₽";
          cartCountNav.innerHTML = order_cards_left.children.length - 1;
          cartCountTitle.innerHTML = order_cards_left.children.length - 1;
          minus.disabled = false;
        })
        .catch((err) => {
          console.log(err);
          minus.disabled = false;
        });
    });
    productItemFormPlus[index].addEventListener("click", () => {
      const productid =
        productItemFormPlus[index].getAttribute("data-productid");

      productItemFormPlus[index].disabled = true;

      fetchCount(productid, "plus")
        .then((res) => {
          const countPrice =
            minus.parentElement.parentElement.parentElement.parentElement
              .childNodes[3].childNodes[1].childNodes[1];
          countPrice.innerHTML =
            countPrice.getAttribute("data-price") * res.data.count;

          productItemFormCount[index].innerHTML = res.data.count;
          total_price.innerHTML = res.data.price + " ₽";
          productItemFormPlus[index].disabled = false;
          cartCountNav.innerHTML = order_cards_left.children.length - 1;
          cartCountTitle.innerHTML = order_cards_left.children.length - 1;
        })
        .catch((err) => {
          productItemFormPlus[index].disabled = false;
          alert(err);
        });
    });
  });

  function selectProduct() {
    const selectCart = document.querySelectorAll(".order_cards_card");
    selectCart.forEach((item) => {
      item.addEventListener("click", () => {
        item.classList.toggle("selected");
      });
    });
  }

  // function selectAll() {
  //   let selectCart = document.querySelectorAll(".order_cards_card");
  //   selectCart.forEach((item) => {
  //     item.click();
  //   });
  // }

  // const selAll = document.querySelector(".choose");
  // selAll.addEventListener("click", selectAll);

  selectProduct();
  const remove_form = document.querySelector(".remove_form");
  const remove = document.querySelector(".choose_remove .remove");
  remove.addEventListener("click", () => {
    const selectCart = document.querySelectorAll(".order_cards_card");
    let products = [];
    selectCart.forEach((item) => {
      if (item.classList.contains("selected")) {
        products.push(item.getAttribute("data-id"));
      }
    });

    products.forEach((pr) => {
      const input = document.createElement("input");
      input.value = pr;
      input.setAttribute("name", "products");
      remove_form.appendChild(input);
    });

    remove_form.submit();

    // const form = document.createElement("form");
    // form.setAttribute("action", "/shopping/removes");
    // form.setAttribute("method", "post");

    // form.submit();
  });
});
