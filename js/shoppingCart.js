// Getting from HTML
const showItems = document.querySelector('#showItems') // Left
// Right
const showAllItemsValue = document.querySelector('#showAllItemsValue')
const showDelivery = document.querySelector('#showDelivery')
const showDiscount = document.querySelector('#showDiscount')
const showTotal = document.querySelector('#showTotal')
const promotionCode = document.querySelector('#promotionCode')
const addPromotionCode = document.querySelector('#addPromotionCode')
const wantDelivery = document.querySelector('#wantDelivery')
const dontWantDelivery = document.querySelector('#dontWantDelivery')

// Get
const getCart = () => JSON.parse(localStorage.getItem('cart')) || []

// Set
const setCart = cartData => localStorage.setItem('cart', JSON.stringify(cartData))

// Items
let cart
let itemsToShow
let allItemsValue
let deliveryValue = 3
let discountValue = 0

// Functions
const generateCart = () => {
    const cartItems = getCart()

    cart = []
    allItemsValue = 0

    cartItems.forEach(prod => {
        const item = products.find(element => element.id === prod.id)
        item.qtd = prod.qtd

        allItemsValue += item.price * item.qtd
        cart.push(item)
    })

    return cart
}

const addItemToItemsToShow = prod => {
    const price = (prod.price * prod.qtd).toFixed(2).toString().replace('.', ',')

    itemsToShow += `
    <div class="item">
        <img src="../img/${prod.img}" alt="Imagem de um(a) ${prod.name}">
        <div>
            <p class="title">${prod.name}</p>
            <p>${prod.description}</p>
            <div class="bottom">
                <div class="counter">
                    <button onclick="remItem(${prod.id})">-</button>
                    <input type="text" value="${prod.qtd}" disabled>
                    <button onclick="addItem(${prod.id})">+</button>
                </div>
                <p class="price">R$ <span>${price}</span></p>
            </div>
        </div>
    </div>
    <hr>`
}

const addItem = id => {
    const cartItems = getCart()
    const newCartItems = []

    cartItems.map(item => {
        if (item.id === id)
            newCartItems.push({ id: item.id, qtd: item.qtd + 1 })
        else
            newCartItems.push({ id: item.id, qtd: item.qtd })
    })

    setCart(newCartItems)
    init()
}

const remItem = id => {
    const cartItems = getCart()
    const newCartItems = []

    cartItems.map(item => {
        if (item.id === id && item.qtd > 1)
            newCartItems.push({ id: item.id, qtd: item.qtd - 1 })
        else if (item.id === id && item.qtd <= 1)
            itemRemovedNotification.showToast()
        else
            newCartItems.push({ id: item.id, qtd: item.qtd })
    })

    setCart(newCartItems)
    init()
}

const chooseDelivery = option => {
    if (option) {
        wantDelivery.classList.add('active')
        dontWantDelivery.classList.remove('active')

        deliveryValue = 3
    } else {
        wantDelivery.classList.remove('active')
        dontWantDelivery.classList.add('active')

        deliveryValue = 0
    }

    init()
}

const addDiscount = () => {
    const code = promotionCode.value.trim().toLowerCase()

    if (code === 'easteregg') {
        discountValue = 15
        appliedCode.showToast()

        init()
    } else codeNotFound.showToast()
}

const init = () => {
    const generatedCart = generateCart()
    generatedCart.length > 0 && generatedCart.sort((a, b) => a.id < b.id ? -1 : a.id > b.id ? 1 : 0 )

    itemsToShow = ''
    showItems.innerHTML = ''

    if (generatedCart.length > 0)
        generatedCart.forEach(data => addItemToItemsToShow(data));
    else
        itemsToShow = '<p>Você ainda não adicionou itens no carrinho.</p>'

    // Showing on page
    showOnPage()
}

const showOnPage = () => {
    showItems.innerHTML = itemsToShow

    const totalValue = allItemsValue + deliveryValue
    showAllItemsValue.innerHTML = 'R$ ' + allItemsValue.toFixed(2).toString().replace('.', ',')
    showDelivery.innerHTML = '+ R$ ' + deliveryValue.toFixed(2).toString().replace('.', ',')
    showDiscount.innerHTML = '- R$ ' + ((totalValue * discountValue)/100).toFixed(2).toString().replace('.', ',')
    showTotal.innerHTML = 'R$ ' + (totalValue - ((totalValue * discountValue)/100)).toFixed(2).toString().replace('.', ',')
}

// Notifications
const itemRemovedNotification = Toastify({
    text: "Produto removido do carrinho de compras.",
    duration: 5000,
    newWindow: true,
    close: true,
    gravity: "bottom",
    position: "right",
    stopOnFocus: true,
    style: {
        background: "#FF7F0A",
        boxShadow: "0 0 160px 0 #0008"
    }
})

const appliedCode = Toastify({
    text: "Cupom aplicado com sucesso!",
    duration: 5000,
    newWindow: true,
    close: true,
    gravity: "bottom",
    position: "right",
    stopOnFocus: true,
    style: {
        background: "#FF7F0A",
        boxShadow: "0 0 160px 0 #0008"
    }
})

const codeNotFound = Toastify({
    text: "Cupom não encontrado!",
    duration: 5000,
    newWindow: true,
    close: true,
    gravity: "bottom",
    position: "right",
    stopOnFocus: true,
    style: {
        background: "#FF7F0A",
        boxShadow: "0 0 160px 0 #0008"
    }
})

addPromotionCode.addEventListener('click', addDiscount)
wantDelivery.addEventListener('click', function () { chooseDelivery(true) })
dontWantDelivery.addEventListener('click', function () { chooseDelivery(false) })

init()

// Easter Egg
console.log('Você achou o Easter Egg do site =D\nUse o cupom EASTEREGG e ganhe 15% de desconto!')