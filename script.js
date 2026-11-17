/* ==========================================================
   COZINHA TROPICAL — funcionalidades
   Seções: 1 Dados · 2 Utilitários · 3 Armazenamento · 4 Avaliação
           5 Cards · 6 Pesquisa e filtros · 7 Páginas · 8 Modal
           9 Cadastro · 10 Inicialização
   ========================================================== */
(function () {
  'use strict';

  /* ---------- 1. DADOS ---------- */
  var CHAVES = { receitas: 'ct_receitas', notas: 'ct_notas', edicoes: 'ct_edicoes' };

  var CATEGORIAS = [
    { id: 'principais', nome: 'Pratos principais', icone: '🍲', rota: 'principais' },
    { id: 'petiscos',   nome: 'Petiscos e lanches', icone: '🥟', rota: 'petiscos' },
    { id: 'sobremesas', nome: 'Sobremesas', icone: '🍮', rota: 'sobremesas' }
  ];

  /* As 14 receitas iniciais. Os ingredientes são apenas os citados na descrição
     fornecida; modo de preparo e tempo ficam em branco para preenchimento
     posterior (botão "Completar receita"). */
  var BASE = [
    { id: 'feijoada', nome: 'Feijoada', categoria: 'principais', destaque: true,
      descricao: 'Ensopado de feijão-preto cozido lentamente com carnes salgadas e defumadas, como carne-seca, paio e costelinha. É servida tradicionalmente com arroz branco, couve refogada, farofa e laranja.',
      ingredientes: ['feijão-preto', 'carne-seca', 'paio', 'costelinha', 'arroz branco', 'couve refogada', 'farofa', 'laranja'] },
    { id: 'baiao-de-dois', nome: 'Baião de dois', categoria: 'principais',
      descricao: 'Clássico nordestino preparado com arroz e feijão-de-corda cozidos juntos no mesmo caldo. Recebe carne-seca desfiada, bacon, queijo coalho em cubos e coentro fresco.',
      ingredientes: ['arroz', 'feijão-de-corda', 'carne-seca desfiada', 'bacon', 'queijo coalho', 'coentro'] },
    { id: 'moqueca', nome: 'Moqueca', categoria: 'principais', destaque: true,
      descricao: 'Cozido de peixe ou camarão feito com leite de coco, pimentões, tomates e coentro. A versão baiana leva azeite de dendê, enquanto a capixaba utiliza azeite de oliva e urucum.',
      ingredientes: ['peixe ou camarão', 'leite de coco', 'pimentão', 'tomate', 'coentro', 'azeite de dendê (versão baiana)', 'azeite de oliva (versão capixaba)', 'urucum (versão capixaba)'] },
    { id: 'camarao-na-moranga', nome: 'Camarão na moranga', categoria: 'principais', destaque: true,
      descricao: 'Camarões refogados em um creme rico de tomate, leite de coco e requeijão cremoso, servidos dentro de uma abóbora moranga assada.',
      ingredientes: ['camarão', 'tomate', 'leite de coco', 'requeijão cremoso', 'abóbora moranga'] },
    { id: 'vaca-atolada', nome: 'Vaca atolada', categoria: 'principais',
      descricao: 'Prato típico do interior feito com costela bovina e mandioca cozidas juntas até desmancharem em um caldo encorpado.',
      ingredientes: ['costela bovina', 'mandioca'] },
    { id: 'arroz-carreteiro', nome: 'Arroz carreteiro', categoria: 'principais',
      descricao: 'Receita tradicional do Sul do Brasil preparada com arroz refogado com charque desfiado, cebola, alho e cheiro-verde.',
      ingredientes: ['arroz', 'charque desfiado', 'cebola', 'alho', 'cheiro-verde'] },
    { id: 'virado-a-paulista', nome: 'Virado à paulista', categoria: 'principais',
      descricao: 'Prato completo de São Paulo que combina arroz, tutu de feijão engrossado com farinha de mandioca, bisteca suína, ovo frito, couve e banana à milanesa.',
      ingredientes: ['arroz', 'feijão', 'farinha de mandioca', 'bisteca suína', 'ovo', 'couve', 'banana'] },
    { id: 'barreado', nome: 'Barreado', categoria: 'principais',
      descricao: 'Prato tradicional do litoral do Paraná feito com carne bovina cozida por horas em panela de barro vedada até desfiar completamente, servido com farinha de mandioca e banana.',
      ingredientes: ['carne bovina', 'farinha de mandioca', 'banana'] },
    { id: 'pao-de-queijo', nome: 'Pão de queijo', categoria: 'petiscos', destaque: true,
      descricao: 'Quitanda mineira assada feita com polvilho escaldado, leite, óleo, ovos e queijo curado ralado.',
      ingredientes: ['polvilho', 'leite', 'óleo', 'ovos', 'queijo curado ralado'] },
    { id: 'coxinha-de-frango', nome: 'Coxinha de frango', categoria: 'petiscos',
      descricao: 'Salgado em formato de gota com massa cozida de caldo de galinha ou batata, recheado com frango desfiado temperado, empanado e frito.',
      ingredientes: ['caldo de galinha ou batata', 'frango desfiado'] },
    { id: 'acaraje', nome: 'Acarajé', categoria: 'petiscos', destaque: true,
      descricao: 'Bolinho de massa de feijão-fradinho frito no azeite de dendê e recheado com vatapá, caruru, camarão seco e vinagrete.',
      ingredientes: ['feijão-fradinho', 'azeite de dendê', 'vatapá', 'caruru', 'camarão seco', 'vinagrete'] },
    { id: 'bolinho-de-bacalhau', nome: 'Bolinho de bacalhau', categoria: 'petiscos',
      descricao: 'Petisco clássico de boteco feito com bacalhau dessalgado e desfiado, batata cozida, ovos e cheiro-verde, moldado e frito até dourar.',
      ingredientes: ['bacalhau dessalgado', 'batata cozida', 'ovos', 'cheiro-verde'] },
    { id: 'brigadeiro', nome: 'Brigadeiro', categoria: 'sobremesas',
      descricao: 'Doce brasileiro feito com leite condensado, manteiga e chocolate em pó cozidos até dar ponto de enrolar e cobertos com chocolate granulado.',
      ingredientes: ['leite condensado', 'manteiga', 'chocolate em pó', 'chocolate granulado'] },
    { id: 'bolo-de-rolo', nome: 'Bolo de rolo', categoria: 'sobremesas', destaque: true,
      descricao: 'Patrimônio cultural de Pernambuco feito com camadas muito finas de massa de pão de ló intercaladas com goiabada derretida e enroladas em formato de rocambole.',
      ingredientes: ['massa de pão de ló', 'goiabada'] }
  ];
  BASE.forEach(function (r) { r.imagem = 'images/' + r.id + '.jpg'; r.base = true; r.preparo = ''; r.tempo = ''; });

  /* ---------- 2. UTILITÁRIOS ---------- */
  function $(s, raiz) { return (raiz || document).querySelector(s); }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  /* minúsculas e sem acentos, para pesquisar sem se preocupar com grafia */
  function norm(s) { return String(s).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim(); }
  /* remove "s" final de cada palavra (ovos = ovo) */
  function radical(s) { return norm(s).replace(/s(?=\s|$)/g, ''); }
  function fmt(n) { return n.toFixed(1).replace('.', ','); }
  function nomeCategoria(id) {
    var c = CATEGORIAS.filter(function (x) { return x.id === id; })[0];
    return c ? c.nome : '';
  }
  function linhas(texto) {
    return String(texto).split('\n').map(function (l) { return l.trim(); }).filter(Boolean);
  }
  var timerAviso;
  function aviso(msg, erro) {
    var t = $('#toast');
    t.textContent = msg;
    t.className = 'toast show' + (erro ? ' erro' : '');
    clearTimeout(timerAviso);
    timerAviso = setTimeout(function () { t.className = 'toast'; }, 3500);
  }
  /* imagem provisória (receita sem foto) */
  function placeholder(nome) {
    var n = nome.length > 26 ? nome.slice(0, 25) + '…' : nome;
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">' +
      '<rect width="800" height="600" fill="#F3E6CF"/><circle cx="400" cy="230" r="80" fill="#F7C531"/>' +
      '<path d="M400 160c40 10 60 50 35 90-40-5-65-40-35-90z" fill="#1E8B4C"/>' +
      '<text x="400" y="400" font-family="Arial,sans-serif" font-size="44" font-weight="700" text-anchor="middle" fill="#146437">' + esc(n) + '</text>' +
      '<text x="400" y="455" font-family="Arial,sans-serif" font-size="26" text-anchor="middle" fill="#7a5c2e">Foto em breve</text></svg>';
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  }
  /* se a imagem não carregar, mostra a provisória */
  document.addEventListener('error', function (e) {
    var t = e.target;
    if (t && t.tagName === 'IMG' && t.dataset.nome && !t.dataset.fb) {
      t.dataset.fb = '1';
      t.src = placeholder(t.dataset.nome);
    }
  }, true);

  /* ---------- 3. ARMAZENAMENTO (LocalStorage) ---------- */
  function carregar(chave, padrao) {
    try { var v = localStorage.getItem(chave); return v ? JSON.parse(v) : padrao; } catch (e) { return padrao; }
  }
  function salvar(chave, valor) {
    try { localStorage.setItem(chave, JSON.stringify(valor)); return true; }
    catch (e) { aviso('Não foi possível salvar neste navegador (armazenamento cheio ou bloqueado).', true); return false; }
  }
  var cadastradas = carregar(CHAVES.receitas, []);
  var notas = carregar(CHAVES.notas, {});
  var edicoes = carregar(CHAVES.edicoes, {});

  /* lista completa: iniciais + cadastradas, já com as edições aplicadas */
  function todas() {
    return BASE.concat(cadastradas).map(function (r) { return Object.assign({}, r, edicoes[r.id] || {}); });
  }
  function buscar(id) { return todas().filter(function (r) { return r.id === id; })[0]; }

  /* ---------- 4. AVALIAÇÃO ---------- */
  function media(id) { var n = notas[id]; return n && n.count ? n.sum / n.count : 0; }
  function qtd(id) { return notas[id] ? notas[id].count : 0; }
  function avaliar(id, valor) {
    var n = notas[id] || { sum: 0, count: 0, mine: 0 };
    if (n.mine) { n.sum += valor - n.mine; } else { n.sum += valor; n.count += 1; }
    n.mine = valor;
    notas[id] = n;
    return salvar(CHAVES.notas, notas);
  }
  function estrelas(id) {
    var m = media(id), c = qtd(id);
    var txt = c ? fmt(m) + ' (' + c + (c === 1 ? ' avaliação' : ' avaliações') + ')' : 'Sem avaliações';
    return '<span class="nota"><span class="stars" style="--p:' + (m / 5 * 100).toFixed(0) + '%" role="img" aria-label="' +
      (c ? 'Nota média ' + fmt(m) + ' de 5' : 'Sem avaliações') + '">★★★★★</span><span class="nota-txt">' + txt + '</span></span>';
  }

  /* ---------- 5. CARDS ---------- */
  function imgTag(r, classe) {
    return '<img ' + (classe ? 'class="' + classe + '" ' : '') + 'src="' + esc(r.imagem || placeholder(r.nome)) + '" alt="Foto de ' +
      esc(r.nome) + '" loading="lazy" data-nome="' + esc(r.nome) + '">';
  }
  function card(r, extra) {
    return '<article class="card"><div class="card-img">' + imgTag(r) + '<span class="selo">' + esc(nomeCategoria(r.categoria)) + '</span></div>' +
      '<div class="card-corpo"><h3>' + esc(r.nome) + '</h3><p class="desc">' + esc(r.descricao) + '</p>' +
      estrelas(r.id) + (extra || '') +
      '<button class="btn" type="button" data-ver="' + esc(r.id) + '">Ver receita</button></div></article>';
  }

  /* ---------- 6. PESQUISA E FILTROS ---------- */
  var estado = { cat: 'todas', q: '', ordem: 'az', tenho: [], tenhoTxt: [] };

  var ordenar = {
    az: function (a, b) { return a.nome.localeCompare(b.nome, 'pt-BR'); },
    nota: function (a, b) { return (media(b.id) - media(a.id)) || (qtd(b.id) - qtd(a.id)) || ordenar.az(a, b); },
    qtd: function (a, b) { return (qtd(b.id) - qtd(a.id)) || (media(b.id) - media(a.id)) || ordenar.az(a, b); }
  };

  /* compara os ingredientes que o usuário tem com os da receita */
  function comparar(r) {
    var tem = [], falta = [];
    (r.ingredientes || []).forEach(function (ing) {
      var n = radical(ing);
      var ok = estado.tenho.some(function (h) { return n.indexOf(h) !== -1 || (n.length >= 3 && h.indexOf(n) !== -1); });
      (ok ? tem : falta).push(ing);
    });
    return { tem: tem, falta: falta };
  }
  function infoIngredientes(c) {
    if (!c.falta.length) return '<p class="ing-info"><span class="ok">✅ Você tem todos os ingredientes listados!</span></p>';
    return '<p class="ing-info"><strong>Você tem:</strong> ' + esc(c.tem.join(', ')) +
      '<br><span class="falta"><strong>Faltam:</strong> ' + esc(c.falta.join(', ')) + '</span></p>';
  }

  /* devolve [{r, comp}] já filtrado e ordenado */
  function filtrar() {
    var lista = todas();
    if (estado.cat !== 'todas') lista = lista.filter(function (r) { return r.categoria === estado.cat; });
    var termos = norm(estado.q).split(/\s+/).filter(Boolean);
    if (termos.length) {
      lista = lista.filter(function (r) {
        var h = norm(r.nome + ' ' + r.descricao + ' ' + (r.ingredientes || []).join(' '));
        return termos.every(function (t) { return h.indexOf(t) !== -1; });
      });
    }
    var itens = lista.map(function (r) { return { r: r, comp: null }; });
    if (estado.tenho.length) {
      itens.forEach(function (x) { x.comp = comparar(x.r); });
      itens = itens.filter(function (x) { return x.comp.tem.length > 0; });
      itens.sort(function (a, b) { return (a.comp.falta.length - b.comp.falta.length) || ordenar[estado.ordem](a.r, b.r); });
    } else {
      itens.sort(function (a, b) { return ordenar[estado.ordem](a.r, b.r); });
    }
    return itens;
  }

  /* ---------- 7. PÁGINAS ---------- */
  var rotaAtual = '';
  var manterBusca = false;

  function ir(hash) { if (location.hash === hash) rota(); else location.hash = hash; }

  function mostrar(id) {
    ['home', 'lista', 'cadastro'].forEach(function (v) { $('#view-' + v).hidden = (v !== id); });
  }

  function desenharHome() {
    var todasR = todas();
    $('#homeDestaques').innerHTML = todasR.filter(function (r) { return r.destaque; }).map(function (r) { return card(r); }).join('');

    $('#homeCategorias').innerHTML = CATEGORIAS.map(function (c) {
      var n = todasR.filter(function (r) { return r.categoria === c.id; }).length;
      return '<a class="cat-card" href="#/' + c.rota + '"><div class="ico">' + c.icone + '</div><strong>' + c.nome + '</strong><span>' + n + (n === 1 ? ' receita' : ' receitas') + '</span></a>';
    }).join('');

    var avaliadas = todasR.filter(function (r) { return qtd(r.id) > 0; }).sort(ordenar.nota).slice(0, 3);
    $('#homeTop').innerHTML = avaliadas.map(function (r) { return card(r); }).join('');
    $('#homeTopVazio').hidden = avaliadas.length > 0;

    $('#homeRanking').innerHTML = todasR.slice().sort(ordenar.nota).map(function (r, i) {
      return '<li><button class="rank-item" type="button" data-ver="' + esc(r.id) + '"><span class="pos">' + (i + 1) + '</span>' + imgTag(r) +
        '<span class="rank-nome">' + esc(r.nome) + '<small>' + esc(nomeCategoria(r.categoria)) + '</small></span>' + estrelas(r.id) + '</button></li>';
    }).join('');
  }

  var TITULOS = {
    todas: ['Todas as receitas', 'Explore todas as receitas ou use a pesquisa e os filtros.'],
    principais: ['Pratos principais', 'Receitas para o almoço e o jantar.'],
    petiscos: ['Petiscos e lanches', 'Para o lanche, o boteco e a mesa de festa.'],
    sobremesas: ['Sobremesas', 'Doces para fechar a refeição.'],
    ingredientes: ['O que dá para preparar?', 'Informe os ingredientes que você tem em casa e veja o que falta para cada receita.']
  };

  function desenharLista() {
    var t = TITULOS[rotaAtual] || TITULOS.todas;
    $('#listaTitulo').textContent = t[0];
    $('#listaSub').textContent = t[1];
    $('#q').value = estado.q;
    $('#ordem').value = estado.ordem;

    var chips = [{ id: 'todas', nome: 'Todas' }].concat(CATEGORIAS);
    $('#chipsCat').innerHTML = chips.map(function (c) {
      return '<button type="button" class="chip" data-cat="' + c.id + '" aria-pressed="' + (estado.cat === c.id) + '">' + esc(c.nome) + '</button>';
    }).join('');

    $('#ingTags').innerHTML = estado.tenhoTxt.map(function (h, i) {
      return '<span class="tag">' + esc(h) + '<button type="button" data-rem="' + i + '" aria-label="Remover ' + esc(h) + '">×</button></span>';
    }).join('');
    $('#ingLimpar').hidden = !estado.tenho.length;

    var itens = filtrar();
    $('#grade').innerHTML = itens.map(function (x) { return card(x.r, x.comp ? infoIngredientes(x.comp) : ''); }).join('');
    $('#vazio').hidden = itens.length > 0;
    $('#contagem').textContent = itens.length ? itens.length + (itens.length === 1 ? ' receita encontrada' : ' receitas encontradas') : '';
  }

  function desenharTudo() {
    if (!$('#view-home').hidden) desenharHome();
    if (!$('#view-lista').hidden) desenharLista();
  }

  /* roteador simples por hash: #/, #/todas, #/principais, ... */
  function rota() {
    var r = (location.hash.replace(/^#\/?/, '') || '').split('?')[0];
    if (['', 'todas', 'principais', 'petiscos', 'sobremesas', 'ingredientes', 'cadastrar'].indexOf(r) === -1) r = '';
    rotaAtual = r;
    if (!manterBusca) { estado.q = ''; if (r !== 'ingredientes') { estado.tenho = []; estado.tenhoTxt = []; } }
    manterBusca = false;

    $('#menu').classList.remove('aberto');
    $('#menuBtn').setAttribute('aria-expanded', 'false');
    document.querySelectorAll('.menu a').forEach(function (a) {
      if (a.getAttribute('data-nav') === (r === 'ingredientes' ? 'todas' : r)) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });

    if (r === '') { mostrar('home'); desenharHome(); }
    else if (r === 'cadastrar') { mostrar('cadastro'); }
    else {
      estado.cat = (r === 'todas' || r === 'ingredientes') ? 'todas' : r;
      mostrar('lista');
      $('#ingPainel').open = (r === 'ingredientes') || estado.tenho.length > 0;
      desenharLista();
    }
    window.scrollTo(0, 0);
  }

  /* ---------- 8. MODAL DE DETALHES ---------- */
  var modal = $('#modal');
  var abertaId = null;

  function abrir(id) {
    abertaId = id;
    desenharModal(false);
    if (typeof modal.showModal === 'function') { if (!modal.open) modal.showModal(); }
    else modal.setAttribute('open', '');
  }
  function fechar() {
    if (typeof modal.close === 'function') modal.close(); else modal.removeAttribute('open');
    abertaId = null;
  }

  function desenharModal(editando) {
    var r = buscar(abertaId);
    if (!r) return;
    var minha = (notas[r.id] && notas[r.id].mine) || 0;
    var temIng = r.ingredientes && r.ingredientes.length;
    var ingEditado = !!(edicoes[r.id] && edicoes[r.id].ingredientes);

    var html = '<button class="fechar" type="button" data-fechar aria-label="Fechar">×</button>' + imgTag(r, 'm-img') +
      '<div class="m-corpo"><span class="selo">' + esc(nomeCategoria(r.categoria)) + '</span><h2 id="mTitulo">' + esc(r.nome) + '</h2>' + estrelas(r.id) +
      '<p>' + esc(r.descricao) + '</p>' +
      '<p><strong>⏱ Tempo de preparo:</strong> ' + (r.tempo ? esc(r.tempo) : 'não informado') + '</p>' +
      '<h3>Ingredientes</h3>' +
      (temIng ? '<ul>' + r.ingredientes.map(function (i) { return '<li>' + esc(i) + '</li>'; }).join('') + '</ul>' : '<p class="aviso">Ingredientes ainda não cadastrados.</p>') +
      ((r.base && !ingEditado) ? '<p class="aviso">Lista com os ingredientes citados na descrição. Quantidades e demais itens podem ser preenchidos em “Completar receita”.</p>' : '') +
      '<h3>Modo de preparo</h3>' +
      (r.preparo ? '<p class="pre">' + esc(r.preparo) + '</p>' : '<p class="aviso">Modo de preparo ainda não cadastrado. Use “Completar receita” para preencher.</p>') +
      '<h3>Avalie esta receita</h3><div class="nota-input" role="group" aria-label="Dar nota de 1 a 5 estrelas">' +
      [5, 4, 3, 2, 1].map(function (n) { return '<button type="button" data-nota="' + n + '" class="' + (n <= minha ? 'on' : '') + '" aria-label="' + n + (n === 1 ? ' estrela' : ' estrelas') + '">★</button>'; }).join('') +
      '</div>' + (minha ? '<p class="nota-txt">Sua nota: ' + minha + ' de 5. Clique em outra estrela para mudar.</p>' : '<p class="nota-txt">Clique em uma estrela para avaliar.</p>') +
      '<div class="acoes"><button class="btn sec" type="button" data-editar>✏️ Completar receita</button>' +
      (r.base ? '' : '<button class="btn perigo" type="button" data-excluir>🗑 Excluir receita</button>') + '</div>' +
      '<form class="form-edit" id="formEdit" ' + (editando ? '' : 'hidden') + '>' +
      '<label for="eIng">Ingredientes <small>(um por linha)</small></label><textarea id="eIng" rows="6">' + esc((r.ingredientes || []).join('\n')) + '</textarea>' +
      '<label for="ePrep">Modo de preparo</label><textarea id="ePrep" rows="6">' + esc(r.preparo || '') + '</textarea>' +
      '<label for="eTempo">Tempo de preparo</label><input id="eTempo" type="text" maxlength="40" value="' + esc(r.tempo || '') + '">' +
      '<div class="acoes"><button class="btn" type="submit">Salvar alterações</button><button class="btn sec" type="button" data-cancelar>Cancelar</button></div></form>' +
      '</div>';
    modal.innerHTML = html;
  }

  /* ---------- 9. CADASTRO ---------- */
  function lerImagem(arquivo) {
    return new Promise(function (ok, erro) {
      var fr = new FileReader();
      fr.onerror = erro;
      fr.onload = function () {
        var img = new Image();
        img.onerror = erro;
        img.onload = function () {
          var k = Math.min(1, 800 / Math.max(img.width, img.height));
          var c = document.createElement('canvas');
          c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
          c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
          ok(c.toDataURL('image/jpeg', 0.8));
        };
        img.src = fr.result;
      };
      fr.readAsDataURL(arquivo);
    });
  }

  function mostrarErro(msg) { var e = $('#cErro'); e.textContent = msg; e.hidden = !msg; }

  function cadastrar(ev) {
    ev.preventDefault();
    var nome = $('#cNome').value.trim(), desc = $('#cDesc').value.trim(), cat = $('#cCat').value;
    var ings = linhas($('#cIng').value), prep = $('#cPrep').value.trim(), tempo = $('#cTempo').value.trim();
    if (!nome || !desc || !cat || !ings.length || !prep) { mostrarErro('Preencha nome, descrição, categoria, ingredientes e modo de preparo.'); return; }
    if (todas().some(function (r) { return norm(r.nome) === norm(nome); })) { mostrarErro('Já existe uma receita com esse nome.'); return; }
    mostrarErro('');

    var arq = $('#cImg').files[0];
    var pronto = arq ? lerImagem(arq).catch(function () { aviso('Não foi possível ler a imagem. A receita será salva sem foto.', true); return ''; }) : Promise.resolve('');
    pronto.then(function (imagem) {
      var nova = { id: 'u-' + Date.now().toString(36), nome: nome, descricao: desc, categoria: cat, ingredientes: ings, preparo: prep, tempo: tempo, imagem: imagem };
      cadastradas.push(nova);
      if (!salvar(CHAVES.receitas, cadastradas)) { cadastradas.pop(); return; }
      $('#formCad').reset();
      aviso('Receita “' + nome + '” cadastrada com sucesso!');
      ir('#/' + (CATEGORIAS.filter(function (c) { return c.id === cat; })[0].rota));
    });
  }

  /* ---------- 10. INICIALIZAÇÃO E EVENTOS ---------- */
  $('#cCat').innerHTML = '<option value="">Escolha a categoria…</option>' + CATEGORIAS.map(function (c) { return '<option value="' + c.id + '">' + c.nome + '</option>'; }).join('');

  /* cliques em qualquer lugar (delegação) */
  document.addEventListener('click', function (e) {
    var el;
    if ((el = e.target.closest('[data-ver]'))) { abrir(el.getAttribute('data-ver')); return; }
    if ((el = e.target.closest('[data-cat]'))) {
      var c = el.getAttribute('data-cat');
      manterBusca = true;
      ir('#/' + (c === 'todas' ? 'todas' : CATEGORIAS.filter(function (x) { return x.id === c; })[0].rota));
      return;
    }
    if ((el = e.target.closest('[data-rem]'))) { estado.tenho.splice(+el.getAttribute('data-rem'), 1); estado.tenhoTxt.splice(+el.getAttribute('data-rem'), 1); desenharLista(); return; }
  });

  /* eventos dentro do modal */
  modal.addEventListener('click', function (e) {
    if (e.target === modal || e.target.closest('[data-fechar]')) { fechar(); return; }
    var n = e.target.closest('[data-nota]');
    if (n) {
      if (avaliar(abertaId, +n.getAttribute('data-nota'))) { desenharModal(false); desenharTudo(); aviso('Obrigado pela sua avaliação!'); }
      return;
    }
    if (e.target.closest('[data-editar]')) { var f = $('#formEdit'); f.hidden = !f.hidden; if (!f.hidden) f.scrollIntoView({ block: 'nearest' }); return; }
    if (e.target.closest('[data-cancelar]')) { desenharModal(false); return; }
    if (e.target.closest('[data-excluir]')) {
      if (confirm('Excluir esta receita? Essa ação não pode ser desfeita.')) {
        cadastradas = cadastradas.filter(function (r) { return r.id !== abertaId; });
        delete notas[abertaId]; delete edicoes[abertaId];
        salvar(CHAVES.receitas, cadastradas); salvar(CHAVES.notas, notas); salvar(CHAVES.edicoes, edicoes);
        fechar(); desenharTudo(); aviso('Receita excluída.');
      }
    }
  });
  modal.addEventListener('submit', function (e) {
    if (e.target.id !== 'formEdit') return;
    e.preventDefault();
    edicoes[abertaId] = { ingredientes: linhas($('#eIng').value), preparo: $('#ePrep').value.trim(), tempo: $('#eTempo').value.trim() };
    if (salvar(CHAVES.edicoes, edicoes)) { desenharModal(false); desenharTudo(); aviso('Receita atualizada!'); }
  });
  modal.addEventListener('close', function () { abertaId = null; });

  /* busca da página inicial */
  $('#heroForm').addEventListener('submit', function (e) {
    e.preventDefault();
    estado.q = $('#heroQ').value; manterBusca = true; ir('#/todas');
  });
  /* busca, ordenação e ingredientes da listagem */
  $('#q').addEventListener('input', function (e) { estado.q = e.target.value; desenharLista(); });
  $('#ordem').addEventListener('change', function (e) { estado.ordem = e.target.value; desenharLista(); });
  $('#ingForm').addEventListener('submit', function (e) {
    e.preventDefault();
    var inp = $('#ingInput');
    inp.value.split(',').forEach(function (t) {
      var h = radical(t);
      if (h.length >= 2 && estado.tenho.indexOf(h) === -1) { estado.tenho.push(h); estado.tenhoTxt.push(t.trim()); }
    });
    inp.value = ''; desenharLista(); inp.focus();
  });
  $('#ingLimpar').addEventListener('click', function () { estado.tenho = []; estado.tenhoTxt = []; desenharLista(); });

  $('#formCad').addEventListener('submit', cadastrar);
  $('#menuBtn').addEventListener('click', function () {
    var aberto = $('#menu').classList.toggle('aberto');
    this.setAttribute('aria-expanded', String(aberto));
  });
  window.addEventListener('hashchange', rota);
  rota();
})();
