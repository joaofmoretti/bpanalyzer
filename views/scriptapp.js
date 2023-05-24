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
    carregaCliente();
    carregaTrafego();
		
		
		
		
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
            $("#titulopagina")[0].innerText = data.title;

            $("#resultado")[0].innerText = 'Resultado do Teste: Realizado com sucesso';
            $("#endereço")[0].innerText = 'Endereco: ' + document.getElementById('busca').value; 
            $("#tecnologias")[0].innerText = 'Tecnologias Detectadas: ' + data.technologies.length; 
            $("#contatech")[0].innerText = data.technologies.length;
            $("#ecommerce")[0].innerText = 'Plataforma E-Commerce: ' + data.ecommerce; 
            
            
            $("#Carregando").hide();


		        $("#Resultados").show();
            

              
  }).catch((err) => { console.dir(err);});

}



function buscaCliente() {
  return new Promise((resolve, reject) => {
    let method = "POST";
    let urlaBusca = document.getElementById('busca');  
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
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
          .then(data => {
            console.log(data);
              resolve(data);
          })
          .catch(err => {
            console.log(err);
              reject(err);
          })
  });
}

function carregaCliente() {
    console.log("CarregaCliente")

    buscaCliente().then(cliente => {
        clienteAtual = cliente;

        console.log(cliente);

        
        $("#razao")[0].innerText = clienteAtual.razao_social;
        $("#cnpj")[0].innerText = clienteAtual.estabelecimento.cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
        $("#cidade")[0].innerText = clienteAtual.estabelecimento.cidade.nome;
        $("#estado")[0].innerText = clienteAtual.estabelecimento.estado.nome;
        $("#atividade")[0].innerText = clienteAtual.estabelecimento.atividade_principal.descricao;
        $("#porte")[0].innerText = clienteAtual.porte.descricao;




        let txtSoc = '<div class="content-section-title">Quadro societário</div><ul> ';



        clienteAtual.socios.forEach((socio) => {
            txtSoc = txtSoc  + '<li class="adobe-product"><div class="products">' + socio.nome + '</div><span class="status"><span class="status-circle green"></span> ' 
                            + socio.qualificacao_socio.descricao + '</span></li> ';
        })
        txtSoc = txtSoc + "</ul></div>";

        document.getElementById("quadrosocios").innerHTML=txtSoc;
                        
    }).catch(error => {
        console.log(error);
        throw('Erro ' + error);

  });

}

function buscaTrafego() {
  return new Promise((resolve, reject) => {
    let method = "POST";
    let urlaBusca = document.getElementById('busca');  
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    let raw = JSON.stringify({
                    "busca" : urlaBusca.value
                });
    
      let requestOptions = {
            method: method,
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
          };

      fetch('/trafego/', requestOptions)
          .then(res => res.json())
          .then(data => {
            console.log(data);
              resolve(data);
          })
          .catch(err => {
            console.log(err);
              reject(err);
          })
  });
}

function carregaTrafego() {
  console.log("carregaTrafego")

  buscaTrafego().then(jsonData => {
     

      console.log(jsonData);

      result = jsonData
			
      document.getElementById("tituloSite").innerText=result.Title;  
		document.getElementById("visitas").innerText=Math.ceil(result.Engagments.Visits).toLocaleString();
		document.getElementById("taxa").innerText=(Number.parseFloat(result.Engagments.BounceRate)*100).toFixed(2) + '%';
		document.getElementById("paginas").innerText=Number.parseFloat(result.Engagments.PagePerVisit).toFixed(2);
		document.getElementById("tempo").innerText=Number.parseFloat((result.Engagments.TimeOnSite/60)).toFixed(2);
		let vals = [];
		for (let icont=0; icont < Object.values(result.TrafficSources).length; icont++) {
				if (Object.values(result.TrafficSources)[icont] == null) {
					vals.push(0);
			    } else {
					vals.push(Object.values(result.TrafficSources)[icont]);
				}
		}		
		
		
		console.log("vals valores");
		console.log(vals);
		
		var options = {
          series: vals,
		  labels: Object.keys(result.TrafficSources),
          chart: {
          type: 'donut',
        },
        plotOptions: {
          pie: {
            startAngle: -90,
            endAngle: 90,
            offsetY: 10
          }
        },
		title: {
          text: 'Distribuição dos canais de Marketing',
          align: 'center'
        },
        grid: {
          padding: {
            bottom: -80
          }
        },
        responsive: [{
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: 'bottom'
            }
          }
        }]
        };

        var chart = new ApexCharts(document.querySelector("#chart"), options);
        chart.render();  



                      
  }).catch(error => {
      console.log(error);
      throw('Erro ' + error);

});

}