async function carregarReceitas() {
  try {
    const resposta = await fetch("http://localhost:3000/receitas");
    const receitas = await resposta.json();

    if (!Array.isArray(receitas) || receitas.length === 0) {
      console.warn("Nenhuma receita encontrada!");
      return;
    }

    const categorias = {};

    receitas.forEach(r => {
      if (!categorias[r.categoria]) {
        categorias[r.categoria] = 1;
      } else {
        categorias[r.categoria]++;
      }
    });

    gerarGrafico(categorias);
  } catch (erro) {
    console.error("Erro ao carregar receitas:", erro);
  }
}

function gerarGrafico(categorias) {
  const ctx = document.getElementById("graficoCategorias");

  new Chart(ctx, {
    type: "pie",
    data: {
      labels: Object.keys(categorias),
      datasets: [{
        data: Object.values(categorias),
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "bottom"
        }
      }
    }
  });
}

carregarReceitas();
