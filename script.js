let idProduto = 1;
let totalCaixa = 0;

let produtos = JSON.parse(localStorage.getItem("produtos")) || [];

function cadastrarProduto() {

    let nome = document.getElementById("nome").value;
    let preco = Number(document.getElementById("preco").value);
    let tamanho = document.getElementById("tamanho").value;
    let cor = document.getElementById("cor").value;
    let quantidade = Number(document.getElementById("quantidade").value);

    if (nome === "" || preco <= 0 || tamanho === "" || cor === "" || quantidade <= 0) {
        alert("Preencha todos os campos corretamente!");
        return;
    }

    let produto = {
        id: idProduto,
        nome: nome,
        preco: preco,
        tamanho: tamanho,
        cor: cor,
        quantidade: quantidade
    };

    produtos.push(produto);

    localStorage.setItem("produtos", JSON.stringify(produtos));

    adicionarProdutoNaTabela(produto);

    idProduto++;

    document.getElementById("nome").value = "";
    document.getElementById("preco").value = "";
    document.getElementById("tamanho").value = "";
    document.getElementById("cor").value = "";
    document.getElementById("quantidade").value = "";

    alert("Produto cadastrado com sucesso!");
}


function adicionarProdutoNaTabela(produto) {

    let tabela = document.getElementById("tabelaProdutos");

    let novaLinha = tabela.insertRow();

    novaLinha.insertCell(0).innerText = produto.id;
    novaLinha.insertCell(1).innerText = produto.nome;
    novaLinha.insertCell(2).innerText = "R$ " + produto.preco.toFixed(2);
    novaLinha.insertCell(3).innerText = produto.tamanho;
    novaLinha.insertCell(4).innerText = produto.cor;
    novaLinha.insertCell(5).innerText = produto.quantidade;
}


function registrarVenda() {

    let idVenda = Number(document.getElementById("idVenda").value);
    let quantidadeVenda = Number(document.getElementById("quantidadeVenda").value);

    let tabela = document.getElementById("tabelaProdutos");

    let encontrou = false;

    for (let i = 0; i < tabela.rows.length; i++) {

        let idProdutoTabela = Number(tabela.rows[i].cells[0].innerText);

        if (idProdutoTabela === idVenda) {

            let estoqueAtual = Number(tabela.rows[i].cells[5].innerText);

            if (quantidadeVenda <= 0) {
                alert("Informe uma quantidade válida.");
                return;
            }

            if (quantidadeVenda > estoqueAtual) {
                alert("Quantidade maior que o estoque disponível.");
                return;
            }

            let precoProduto = Number(
                tabela.rows[i].cells[2].innerText.replace("R$ ", "")
            );

            let totalVenda = precoProduto * quantidadeVenda;

            let novoEstoque = estoqueAtual - quantidadeVenda;

            tabela.rows[i].cells[5].innerText = novoEstoque;

            for (let produto of produtos) {

                if (produto.id === idVenda) {
                    produto.quantidade = novoEstoque;
                }
            }

            localStorage.setItem("produtos", JSON.stringify(produtos));

            let tabelaVendas = document.getElementById("tabelaVendas");

            let novaVenda = tabelaVendas.insertRow();

            novaVenda.insertCell(0).innerText =
                tabela.rows[i].cells[1].innerText;

            novaVenda.insertCell(1).innerText =
                quantidadeVenda;

            novaVenda.insertCell(2).innerText =
                "R$ " + totalVenda.toFixed(2);

            totalCaixa = totalCaixa + totalVenda;

            document.getElementById("totalCaixa").innerText =
                totalCaixa.toFixed(2);

            alert(
                "Venda registrada com sucesso!\n\n" +
                "Produto: " + tabela.rows[i].cells[1].innerText +
                "\nQuantidade: " + quantidadeVenda +
                "\nTotal da venda: R$ " + totalVenda.toFixed(2)
            );

            encontrou = true;
            break;
        }
    }

    if (!encontrou) {
        alert("Produto não encontrado.");
    }
}


function carregarProdutos() {

    if (produtos.length > 0) {

        idProduto = Math.max(...produtos.map(produto => produto.id)) + 1;

        for (let produto of produtos) {
            adicionarProdutoNaTabela(produto);
        }
    }
}

carregarProdutos();