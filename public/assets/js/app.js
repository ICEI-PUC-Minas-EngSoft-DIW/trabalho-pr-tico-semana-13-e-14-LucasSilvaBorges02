// ======================================================
// CONFIG API (JSON Server)
// ======================================================
const API_URL = "http://localhost:3000/receitas";

// vai guardar o que a gente realmente vai usar
let receitasFonte = []; // vem da API ou do dados.receitas

// ======================================================
// BASE DE DADOS (LOCAL) — usado como fallback
// ======================================================
const dados = {
  receitas: [
    {
      id: 1,
      nome: "Lasanha à Bolonhesa",
      descricao: "Camadas de massa, carne moída e queijo gratinado.",
      tempoPreparo: "50 minutos",
      porcoes: 6,
      dificuldade: "Média",
      categoria: "Massas",
      destaque: true,
      imagemPrincipal: "assets/img/lasanha.jpg",
      ingredientes: [
        "500g de carne moída",
        "1 pacote de massa para lasanha",
        "400g de molho de tomate",
        "200g de queijo mussarela",
        "100g de presunto",
        "Sal, pimenta e orégano a gosto"
      ],
      modoPreparo: [
        "Cozinhe a carne com o molho de tomate e temperos.",
        "Monte as camadas de massa, carne, presunto e queijo.",
        "Leve ao forno por 30 minutos até gratinar."
      ],
      imagensPassos: [
        "assets/img/lasanha-p1.jpg",
        "assets/img/lasanha-p2.jpg",
        "assets/img/lasanha-p3.jpg"
      ]
    },
    {
      id: 2,
      nome: "Bolo de Cenoura com Cobertura de Chocolate",
      descricao: "O clássico bolo de cenoura fofinho com calda crocante.",
      tempoPreparo: "1 hora",
      porcoes: 8,
      dificuldade: "Fácil",
      categoria: "Sobremesas",
      destaque: true,
      imagemPrincipal: "assets/img/bolo-cenoura.jpg",
      ingredientes: [
        "3 cenouras médias picadas",
        "3 ovos",
        "2 xícaras de farinha de trigo",
        "1 xícara de óleo",
        "2 xícaras de açúcar",
        "1 colher de fermento em pó"
      ],
      modoPreparo: [
        "Bata no liquidificador as cenouras, ovos e óleo.",
        "Adicione o açúcar, farinha e fermento, misturando bem.",
        "Asse por 40 minutos a 180°C e finalize com a calda."
      ],
      imagensPassos: [
        "assets/img/bolo-p1.jpg",
        "assets/img/bolo-p2.jpg",
        "assets/img/bolo-p3.jpg"
      ]
    },
    {
      id: 3,
      nome: "Salada Tropical",
      descricao: "Combinação leve e refrescante de frutas e folhas verdes.",
      tempoPreparo: "15 minutos",
      porcoes: 2,
      dificuldade: "Fácil",
      categoria: "Saladas",
      destaque: false,
      imagemPrincipal: "assets/img/salada-tropical.jpg",
      ingredientes: [
        "Alface e rúcula lavadas",
        "1 manga fatiada",
        "1 maçã em cubos",
        "Tomatinhos cortados ao meio",
        "Molho de iogurte ou azeite e limão"
      ],
      modoPreparo: [
        "Monte as folhas em uma tigela.",
        "Adicione as frutas e os tomates.",
        "Finalize com o molho de sua preferência."
      ],
      imagensPassos: [
        "assets/img/salada-p1.jpg",
        "assets/img/salada-p2.jpg",
        "assets/img/salada-p3.jpg"
      ]
    },
    {
      id: 4,
      nome: "Panqueca Americana",
      descricao: "Fofinha e dourada, perfeita para o café da manhã.",
      tempoPreparo: "25 minutos",
      porcoes: 4,
      dificuldade: "Fácil",
      categoria: "Café da Manhã",
      destaque: false,
      imagemPrincipal: "assets/img/panqueca.jpg",
      ingredientes: [
        "1 xícara de farinha de trigo",
        "1 colher de açúcar",
        "1 xícara de leite",
        "1 ovo",
        "1 colher de fermento em pó",
        "Manteiga para untar"
      ],
      modoPreparo: [
        "Misture os ingredientes até formar uma massa homogênea.",
        "Coloque pequenas porções em uma frigideira quente.",
        "Vire quando formar bolhas e doure do outro lado."
      ],
      imagensPassos: [
        "assets/img/panqueca-p1.jpg",
        "assets/img/panqueca-p2.jpg",
        "assets/img/panqueca-p3.jpg"
      ]
    }
  ]
};

// tenta carregar da API; se falhar, usa local
async function carregarReceitas() {
  try {
    const resp = await fetch(API_URL);
    if (!resp.ok) throw new Error("API fora");
    const apiData = await resp.json();

    // ♥ junta API + dados locais (preenche faltando)
    receitasFonte = apiData.map((item) => {
      const local = dados.receitas.find((r) => r.id === item.id);
      return {
        ...local,     // pega imagem, ingredientes etc
        ...item       // mas mantém o que veio da API (nome, tempo, etc)
      };
    });
  } catch (e) {
    receitasFonte = dados.receitas;
  }
}

// ==============================
// Helpers
// ==============================
function byId(id){ return document.getElementById(id); }
function goDetalhe(id){ window.location.href = 'detalhes.html?id=' + id; }

// ==============================
// Render: HOME
// ==============================
function renderHome(){
  const carousel = byId('carousel-content');
  const cards    = byId('cards-container');
  if(!carousel && !cards) return;

  const lista = receitasFonte.length ? receitasFonte : dados.receitas;
  const destaques = lista.filter(r => r.destaque);

  if (carousel) {
    carousel.innerHTML = destaques.map((r, i) => `
      <div class="carousel-item ${i===0 ? 'active' : ''}">
        <img src="${r.imagemPrincipal}" class="d-block w-100" alt="${r.nome}">
        <div class="carousel-caption bg-dark bg-opacity-50 rounded p-2">
          <h5>${r.nome}</h5>
          <p>${r.descricao}</p>
          <button class="btn btn-light btn-sm" onclick="goDetalhe(${r.id})">Ver Receita</button>
        </div>
      </div>
    `).join('');
  }

  if (cards) {
    cards.innerHTML = lista.map(r => `
      <div class="col-12 col-sm-6 col-lg-4">
        <div class="card h-100 shadow-sm">
          <img src="${r.imagemPrincipal}" class="card-img-top" alt="${r.nome}">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">${r.nome}</h5>
            <p class="card-text small flex-grow-1">${r.descricao}</p>
            <div class="d-flex justify-content-between align-items-center">
              <span class="badge bg-secondary">${r.categoria || 'Receitas'}</span>
              <button class="btn btn-sm btn-primary" onclick="goDetalhe(${r.id})">Ver detalhes</button>
            </div>
          </div>
        </div>
      </div>
    `).join('');
  }
}

// ==============================
// Render: DETALHES
// ==============================
function renderDetalhes(){
  const container = byId('detalhe-container');
  if(!container) return;

  const params  = new URLSearchParams(window.location.search);
  const id      = parseInt(params.get('id'), 10);

  const lista = receitasFonte.length ? receitasFonte : dados.receitas;
  const receita = lista.find(r => r.id === id);

  if(!receita){
    container.innerHTML = '<p>Receita não encontrada. <a href="index.html">Voltar</a></p>';
    return;
  }

  container.innerHTML = `
    <section class="mb-4">
      <h2>${receita.nome}</h2>
      <img src="${receita.imagemPrincipal}" alt="${receita.nome}" class="img-fluid rounded mb-3">
      <ul class="list-group mb-3">
        <li class="list-group-item"><strong>Tempo de preparo:</strong> ${receita.tempoPreparo || '-'}</li>
        <li class="list-group-item"><strong>Porções:</strong> ${receita.porcoes || '-'}</li>
        <li class="list-group-item"><strong>Dificuldade:</strong> ${receita.dificuldade || '-'}</li>
        <li class="list-group-item"><strong>Categoria:</strong> ${receita.categoria || '-'}</li>
      </ul>
      <h4>🧂 Ingredientes</h4>
      <ul>${(receita.ingredientes || []).map(i => `<li>${i}</li>`).join('')}</ul>
      <h4 class="mt-4">👩‍🍳 Modo de preparo</h4>
      <ol>${(receita.modoPreparo || []).map(p => `<li>${p}</li>`).join('')}</ol>
      <div class="text-center mt-4 d-flex gap-2">
        <a href="cadastro_receitas.html?id=${receita.id}" class="btn btn-warning btn-sm">Editar</a>
        <button class="btn btn-danger btn-sm" onclick="excluirReceita(${receita.id})">Excluir</button>
        <button type="button" class="btn btn-secondary btn-sm" onclick="window.history.back()">⬅ Voltar</button>
      </div>
    </section>
    <section class="mt-4">
      <h5>📸 Etapas da Receita</h5>
      <div class="row g-3">
        ${(receita.imagensPassos || []).map(img => `
          <div class="col-12 col-sm-6 col-lg-4">
            <img src="${img}" class="img-fluid rounded shadow-sm">
          </div>
        `).join('')}
      </div>
    </section>
  `;
}

// ==============================
// DELETE (API)
// ==============================
async function excluirReceita(id) {
  if (!confirm("Excluir mesmo?")) return;
  try {
    const resp = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    if (!resp.ok) throw new Error();
    alert("Excluído!");
    window.location.href = "index.html";
  } catch (e) {
    alert("Não consegui excluir na API, mas o site continua.");
  }
}

// ==============================
// HOME-BOOTSTRAP
// ==============================
function initHomeBootstrapFilters(){
  var grid   = document.getElementById('receitas-destaque');
  if(!grid) return;

  var busca  = document.getElementById('busca');
  var sel    = document.getElementById('filtro-categoria');
  var btn    = document.getElementById('btn-pesquisar');
  var limpar = document.getElementById('limpar-filtros');

  const listaBase = receitasFonte.length ? receitasFonte : dados.receitas;

  if(sel && sel.options.length <= 1){
    var categorias = Array.from(new Set(listaBase.map(r => r.categoria))).sort();
    categorias.forEach(function(c){
      var o = document.createElement('option');
      o.value = c; o.textContent = c;
      sel.appendChild(o);
    });
  }

  function render(lista){
    grid.innerHTML = lista.length
      ? lista.map(function(r){
          return (
            '<div class="col-md-6 col-lg-4">' +
              '<div class="card shadow-sm border-0 h-100">' +
                '<img src="'+r.imagemPrincipal+'" class="card-img-top" alt="'+r.nome+'">' +
                '<div class="card-body d-flex flex-column">' +
                  '<h5 class="card-title">'+r.nome+'</h5>' +
                  '<p class="card-text text-secondary flex-grow-1">'+r.descricao+'</p>' +
                  '<a href="detalhes.html?id='+r.id+'" class="btn btn-danger btn-sm mt-2 align-self-start">Ver receita</a>' +
                '</div>' +
              '</div>' +
            '</div>'
          );
        }).join('')
      : '<div class="col-12"><div class="alert alert-warning mb-0">Nenhuma receita encontrada.</div></div>';
  }

  function aplicar(){
    var q   = (busca && busca.value ? busca.value : '').toLowerCase().trim();
    var cat = (sel && sel.value ? sel.value : '').trim();

    var lista = (receitasFonte.length ? receitasFonte : dados.receitas).filter(function(r){
      var matchTexto =
        !q ||
        r.nome.toLowerCase().includes(q) ||
        r.descricao.toLowerCase().includes(q) ||
        (r.categoria || '').toLowerCase().includes(q);

      var matchCat = !cat || r.categoria === cat;
      return matchTexto && matchCat;
    });

    render(lista);
  }

  if(btn)   btn.addEventListener('click', aplicar);
  if(busca) busca.addEventListener('keyup', function(e){ if(e.key === 'Enter') aplicar(); });
  if(sel)   sel.addEventListener('change', aplicar);
  if(limpar) limpar.addEventListener('click', function(){
    if(busca) busca.value = '';
    if(sel)   sel.value   = '';
    aplicar();
  });

  render(listaBase);
}

// ==============================
// Inicialização
// ==============================
document.addEventListener('DOMContentLoaded', async function(){
  await carregarReceitas();    // 1º tenta API
  renderHome();               // index.html
  renderDetalhes();           // detalhes.html
  initHomeBootstrapFilters(); // home-bootstrap.html
});
