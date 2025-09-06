// Update quantity product
const inputsQuantity = document.querySelectorAll("input[name='quantity']");
if(inputsQuantity){
    inputsQuantity.forEach((input) => {
        console.log(input);
        input.addEventListener("change", (e) => {
            const quantity = parseInt(input.value);
            const productId = input.getAttribute("product-id");
            window.location.href = `/cart/update/${productId}/${quantity}`;
        });
    });
}

// End Update quantity product



