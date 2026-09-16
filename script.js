// =========================
// CARRINHO
// =========================

let carrinho = JSON.parse(
    localStorage.getItem("autopecas-carrinho")
) || [];

function verProdutos() {
    document
        .getElementById("produtos")
        .scrollIntoView({
            behavior: "smooth"
        });
}

function adicionarCarrinho(nome, preco) {
    const produtoExistente = carrinho.find(
        produto => produto.nome === nome
    );

    if (produtoExistente) {
        produtoExistente.quantidade++;
    } else {
        carrinho.push({
            nome: nome,
            preco: preco,
            quantidade: 1
        });
    }

    salvarCarrinho();
    atualizarCarrinho();
    abrirCarrinho();
}

function aumentarQuantidade(index) {
    carrinho[index].quantidade++;
    salvarCarrinho();
    atualizarCarrinho();
}

function diminuirQuantidade(index) {
    carrinho[index].quantidade--;
    if (carrinho[index].quantidade <= 0) {
        carrinho.splice(index, 1);
    }
    salvarCarrinho();
    atualizarCarrinho();
}

function removerProduto(index) {
    carrinho.splice(index, 1);
    salvarCarrinho();
    atualizarCarrinho();
}

function atualizarCarrinho() {
    const lista = document.getElementById("lista-carrinho");
    const contador = document.getElementById("contador-carrinho");
    const totalElemento = document.getElementById("total-carrinho");

    lista.innerHTML = "";

    if (carrinho.length === 0) {
        lista.innerHTML = `
            <p class="carrinho-vazio">
                Seu carrinho está vazio.
            </p>
        `;
        contador.textContent = "0";
        totalElemento.textContent = "R$ 0,00";
        return;
    }

    let total = 0;
    let quantidadeTotal = 0;

    carrinho.forEach((produto, index) => {
        total += produto.preco * produto.quantidade;
        quantidadeTotal += produto.quantidade;

        const item = document.createElement("div");
        item.className = "item-carrinho";

        item.innerHTML = `
            <div class="item-info">
                <h3>${produto.nome}</h3>
                <span class="item-preco">
                    R$ ${produto.preco.toFixed(2).replace(".", ",")}
                </span>
            </div>
            <div class="quantidade">
                <button onclick="diminuirQuantidade(${index})">−</button>
                <span>${produto.quantidade}</span>
                <button onclick="aumentarQuantidade(${index})">+</button>
                <button class="remover" onclick="removerProduto(${index})">Remover</button>
            </div>
        `;
        lista.appendChild(item);
    });

    contador.textContent = quantidadeTotal;
    totalElemento.textContent = "R$ " + total.toFixed(2).replace(".", ",");
}

function abrirCarrinho() {
    document.getElementById("carrinho").classList.add("aberto");
}

function fecharCarrinho() {
    document.getElementById("carrinho").classList.remove("aberto");
}

function salvarCarrinho() {
    localStorage.setItem("autopecas-carrinho", JSON.stringify(carrinho));
}

function finalizarCompra() {
    if (carrinho.length === 0) {
        alert("Seu carrinho está vazio!");
        return;
    }

    alert("Compra realizada com sucesso!");
    carrinho = [];
    salvarCarrinho();
    atualizarCarrinho();
    fecharCarrinho();
}

atualizarCarrinho();

if ("serviceWorker" in navigator) {
    navigator.serviceWorker
        .register("service-worker.js")
        .then(() => {
            console.log("Service Worker registrado com sucesso!");
        })
        .catch((erro) => {
            console.error("Erro ao registrar o Service Worker:", erro);
        });
}