const form = document.querySelector("form");
const amount = document.getElementById("amount");
const currency = document.getElementById("currency");
const footer = document.querySelector("main footer");
const description = document.getElementById("description");
const result = document.getElementById("result");

amount.addEventListener("input", () => {
  const hasCharactersRegex = /\D+/g;
  amount.value = amount.value.replace(hasCharactersRegex, "");
});

// Tornamos a função assíncrona (async) para usar o 'await'
form.onsubmit = async (event) => {
  event.preventDefault();

  const selectedCurrency = currency.value; // USD, EUR ou GBP

  try {
    // 1. Buscamos a cotação em tempo real
    const response = await fetch(
      `https://economia.awesomeapi.com.br/last/${selectedCurrency}-BRL`
    );
    const data = await response.json();

    // 2. Extraímos o valor (bid) dinamicamente
    // Se selecionou USD, acessamos data.USDBRL.bid
    const price = parseFloat(data[`${selectedCurrency}BRL`].bid);

    // 3. Definimos o símbolo manualmente baseado na seleção
    const symbols = { USD: "US$", EUR: "€", GBP: "£" };

    // 4. Chamamos sua função de conversão original com o preço atualizado
    convertCurrency(amount.value, price, symbols[selectedCurrency]);
  } catch (error) {
    console.error(error);
    footer.classList.remove("show-result");
    alert("Erro ao obter cotação em tempo real. Verifique sua conexão.");
  }
};

function convertCurrency(amount, price, symbol) {
  try {
    description.textContent = `${symbol} 1 equivale a ${formatCurrencyBRL(
      price
    )}`;

    let total = amount * price;
    // Arredondamos para evitar dízimas longas antes de formatar
    result.textContent = formatCurrencyBRL(total.toFixed(2));

    footer.classList.add("show-result");
  } catch (error) {
    footer.classList.remove("show-result");
    console.log(error);
    alert("Não foi possível converter. Tente novamente mais tarde.");
  }
}

function formatCurrencyBRL(value) {
  return Number(value).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}
