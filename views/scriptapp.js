$(function () {
 $(".menu-link").click(function () {
  $(".menu-link").removeClass("is-active");
  $(this).addClass("is-active");
 });
});

$(function () {
 $(".main-header-link").click(function () {
  $(".main-header-link").removeClass("is-active");
  $(this).addClass("is-active");
  console.log($(this));
  console.log($(this)[0].innerText);
  let aba = $(this)[0].innerText;
  $(".content-wrapper").each(function() { 
	if ($(this)[0].id == aba) {
		$(this).show(); 
	} else {
		$(this).hide();
    }		
	
	
  })  
  
  
 });
});

const dropdowns = document.querySelectorAll(".dropdown");
dropdowns.forEach((dropdown) => {
 dropdown.addEventListener("click", (e) => {
  e.stopPropagation();
  dropdowns.forEach((c) => c.classList.remove("is-active"));
  dropdown.classList.add("is-active");
 });
});

$(".search-bar input")
 .focus(function () {
  $(".header").addClass("wide");
 })
 .blur(function () {
  $(".header").removeClass("wide");
 })
 .keypress(function (e) {
	 if(e.which == 13) {
    $("#Inicial").hide();
    $("#Resultados").hide();
		$("#Carregando").show();
		salvar();
		
		
		
		
    }
 })	 
 ;

function wait(ms){
   var start = new Date().getTime();
   var end = start;
   while(end < start + ms) {
     end = new Date().getTime();
  }
}	

$(document).click(function (e) {
 var container = $(".status-button");
 var dd = $(".dropdown");
 if (!container.is(e.target) && container.has(e.target).length === 0) {
  dd.removeClass("is-active");
 }
});

$(function () {
 $(".dropdown").on("click", function (e) {
  $(".content-wrapper").addClass("overlay");
  e.stopPropagation();
 });
 $(document).on("click", function (e) {
  if ($(e.target).is(".dropdown") === false) {
   $(".content-wrapper").removeClass("overlay");
  }
 });
});

$(function () {
 $(".status-button:not(.open)").on("click", function (e) {
  $(".overlay-app").addClass("is-active");
 });
 $(".pop-up .close").click(function () {
  $(".overlay-app").removeClass("is-active");
 });
});

$(".status-button:not(.open)").click(function () {
 $(".pop-up").addClass("visible");
});

$(".pop-up .close").click(function () {
 $(".pop-up").removeClass("visible");
});

const toggleButton = document.querySelector('.dark-light');

toggleButton.addEventListener('click', () => {
  document.body.classList.toggle('light-mode');
});


function salvar() {

  
  let method = "POST";
  let endereco = '/prospectaSite/';
  

  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

let urlaBusca = document.getElementById('busca');  
//var raw = JSON.stringify(urlaBusca.value);
  let raw = JSON.stringify({
                "busca" : urlaBusca.value
            });

  let requestOptions = {
        method: method,
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };

  fetch(endereco , requestOptions).then((res) => res.json())
          .then((data) => {
            console.log(data);
            $("#Carregando").hide();
		        $("#Resultados").show();

              
  }).catch((err) => { console.dir(err);});

}

function buscaCliente() {
  return new Promise((resolve, reject) => {

    let urlaBusca = document.getElementById('busca');  
    let raw = JSON.stringify({
                    "busca" : urlaBusca.value
                });
    
      let requestOptions = {
            method: method,
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
          };

      fetch('/dadosGoverno/', requestOptions)
          .then(res => res.json())
          .then(data => {post
              resolve(data);
          })
          .catch(err => {
              reject(err);
          })
  });
}

function carregaCliente() {

  buscaCliente().then(cliente => {
      clienteAtual = cliente;

      console.log(cliente);

      let campoNome = document.getElementById('nome');
      campoNome.value = clienteAtual.razao_social;
      campoNome.disabled = true;

      let campoCidade = document.getElementById('cidade');
      campoCidade.value = clienteAtual.estabelecimento.cidade.nome;
      campoCidade.disabled = true;

      let campoEstado = document.getElementById('estado');
      campoEstado.value = clienteAtual.estabelecimento.estado.nome;
      campoEstado.disabled = true;

      let campocnpj = document.getElementById('cnpj');
      campocnpj.value = clienteAtual.estabelecimento.cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1 $2 $3/$4-$5");
      campocnpj.disabled = true;

      let campoPorte = document.getElementById('porte');
      campoPorte.value = clienteAtual.porte.descricao;
      campoPorte.disabled = true;

      let campoatividadeEconomia = document.getElementById('atividadeEconomia');
      campoatividadeEconomia.value = clienteAtual.estabelecimento.atividade_principal.descricao;
      campoatividadeEconomia.disabled = true;


      let txtSoc = '<table width="100%" border=1><tr><td align=center><label>Nome</label></td><td align=center><label>Cargo</label></td></tr> ';

      clienteAtual.socios.forEach((socio) => {
          txtSoc = txtSoc  + '<tr><td><label>' + socio.nome + '</label></td><td><label> ' + socio.qualificacao_socio.descricao + '</label></td></tr> ';
      })
      txtSoc = txtSoc + "</table>";

      document.getElementById("socios").innerHTML=txtSoc;
                      
  }).catch(error => {
      throw('Cliente inexistente com este código ' + codigoCliente);
});

}
