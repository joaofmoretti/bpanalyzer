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

let divEmpodera;
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
  console.log('popup visibel');
 $(".pop-up").addClass("visible");
});

$(".pop-up .close").click(function () {
  console.log('popup invisivel!!!');
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
            //$("#endereço")[0].innerText = 'Endereco: ' + document.getElementById('busca').value; 
            /*$("#NumeroTecnologias")[0].innerText = 'Tecnologias Detectadas: ' + data.technologies.length; 
            $("#contatech")[0].innerText = data.technologies.length;
            $("#ecommerce")[0].innerText = 'Plataforma E-Commerce: ' + data.ecommerce; 
             montaPaginaTecnologias(data);*/
            
            //$("#endereço")[0].innerText = 'Endereco: ' + document.getElementById('busca').value; 
            $("#NumeroTecnologias")[0].innerText = 'Tecnologias Detectadas: ' + 3; 
            $("#contatech")[0].innerText = 3;
            $("#ecommerce")[0].innerText = 'Plataforma E-Commerce: ' +'TOTVS'; 


            $("#Carregando").hide();


		        $("#Resultados").show();
            

              
  }).catch((err) => { console.dir(err); $("#Carregando").hide(); $("#Resultados").show();});

}

function montaPaginaTecnologias(data) {

  var html = [];

  html.push(
    '<div class="content-section" ><div class="content-section-title">Tecnologias detectadas no site</div>',
    ' <ul>');

    for (let contech=0; contech < data.technologies.length; contech++) {

      html.push(' <li class="adobe-product">');
      html.push(' <div class="products">');
      html.push('&nbsp');
      html.push(data.technologies[contech].name);
      html.push(' </div>');
      html.push('<span class="status">');
      html.push('<span class="status-circle green"></span>');
      html.push(data.technologies[contech].categories[0].name);
      html.push('</span>');
      //html.push('<span class="status">');
      //html.push(data.technologies[contech].description);
      //html.push('</span>');


      html.push('<div class="button-wrapper">');
      html.push('<button class="content-button status-button open">Mais Informações</button>');
      
      html.push('</div>');
      html.push('</li>');
    }

    html.push('</ul></div>');
    $("#tecnologias")[0].innerHTML = html.join("");


}

function montaTabelaContatos(data) {

  var html = [];

  html.push(
    '<div class="content-section" ><div class="content-section-title">Contatos do Cliente</div>',
    ' <ul>');

    for (let contech=0; contech < data[0].contacts.contacts.length; contech++) {

      html.push(' <li class="adobe-product">');
      html.push(' <div class="products">');
      html.push('&nbsp');
      html.push(data[0].contacts.contacts[contech].name);
      html.push(' </div>');   
      html.push('<span class="status">');
      html.push('<span class="status-circle green"></span>');
      
      if (data[0].contacts.contacts[contech].label != null && data[0].contacts.contacts[contech].label.name != null ) {
        html.push(data[0].contacts.contacts[contech].label.name)
      } else {
      
        html.push(data[0].contacts.contacts[contech].category)
      }
      if (data[0].contacts.contacts[contech].department != null && data[0].contacts.contacts[contech].department != undefined) {
        html.push(" - " + data[0].contacts.contacts[contech].department);
      }  
      html.push('</span>');
      //html.push('<span class="status">');
      //html.push(data.technologies[contech].description);
      //html.push('</span>');


      html.push('<div class="button-wrapper">');
      html.push('<button class="content-button status-button open" >');
      if (data[0].contacts.contacts[contech].phones != null && data[0].contacts.contacts[contech].phones.length > 0) {
        if (data[0].contacts.contacts[contech].phones[0] != null) {
          if (data[0].contacts.contacts[contech].phones[0].number != null && data[0].contacts.contacts[contech].phones[0].number != '') {
              html.push(data[0].contacts.contacts[contech].phones[0].number);
          } else {
            html.push(data[0].contacts.contacts[contech].email);
          }
        }
      } else {
        html.push(data[0].contacts.contacts[contech].email);
      }
      html.push('</button>');
      
      
      html.push('</div>');
      html.push('</li>');
    }

    html.push('</ul></div>');
    $("#contatosCliente")[0].innerHTML = html.join("");


}

function buscaCliente() {
  console.log("BuscaCliene")
  let method = "POST";
  let urlaBusca = document.getElementById('busca'); 
  let registroBr = fetchRegistroBr(new URL(urlaBusca.value));
  registroBr.then(result => {
      return new Promise((resolve, reject) => {
        let num;
        try{
          let cnpjEncontrado = [result.entities[0].publicIds[0].identifier];
          num = cnpjEncontrado[0].replace(/\D/g,'').substring(0,14);
        } catch (erro) {
          console.log("Não foi possível pegar o CNPJ do domímio");
          console.log(result)
        }

        
        console.log("Bumero aqui " + num);
        let urlObject = new URL(urlaBusca.value);
        
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        let raw = JSON.stringify({
                        "busca" : num
                    });
        
          let requestOptions = {
                method: method,
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
              };

          fetch('/apenasdadosGoverno/', requestOptions)      
              .then(res => res.json())
              .then(data => {
                console.log(data);
                atualizaAbaDadosGovernamentais(data);
                  resolve(data);
              })
              .catch(err => {
                console.log(err);
                  reject(err);
              })
      });
    })
    console.log("terminou o busca cliente")    
}

function carregaCliente() {
    console.log("CarregaCliente")

    let testeCliente = buscaCliente();

    

   

    /*testeCliente.then(cliente => {

        clienteAtual = cliente;
        console.log("testaCliente");
        console.log(cliente);

        
        $("#razao")[0].innerText = clienteAtual.razao_social;
        $("#cnpj")[0].innerText = clienteAtual.estabelecimento.cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
        $("#cidade")[0].innerText = clienteAtual.estabelecimento.cidade.nome;
        $("#estado")[0].innerText = clienteAtual.estabelecimento.estado.nome;
        $("#atividade")[0].innerText = clienteAtual.estabelecimento.atividade_principal.descricao;
        $("#porte")[0].innerText = clienteAtual.porte.descricao;
        $("#capital")[0].innerText = clienteAtual.capital_social.toLocaleString('pt-br', {minimumFractionDigits: 2});




        let txtSoc = '<div class="content-section-title">Quadro societário</div><ul> ';



        clienteAtual.socios.forEach((socio) => {
            txtSoc = txtSoc  + '<li class="adobe-product"><div class="products">' + socio.nome + '</div><span class="status"><span class="status-circle green"></span> ' 
                            + socio.qualificacao_socio.descricao + '</span></li> ';
        })
        txtSoc = txtSoc + "</ul></div>";

        document.getElementById("quadrosocios").innerHTML=txtSoc;


        console.log("Passou pelo carrega cliente");
        if ($("#razao")[0].innerText != '' && $("#razao")[0].innerText != null) {
          console.log('$("#razao")[0].innerText ' + $("#razao")[0].innerText);
            carregaEmpodera($("#cnpj")[0].innerText.split("/")[0]);
        }
                        
    }).catch(error => {
        console.log(error);
        //throw('Erro ' + error);

  });
*/
}


function atualizaAbaDadosGovernamentais(clienteAtual) {
  console.log("atualizaAbaDadosGovernamentais")

 
      
      $("#razao")[0].innerText = clienteAtual.razao_social;
      $("#cnpj")[0].innerText = clienteAtual.estabelecimento.cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
      $("#cidade")[0].innerText = clienteAtual.estabelecimento.cidade.nome;
      $("#estado")[0].innerText = clienteAtual.estabelecimento.estado.nome;
      $("#atividade")[0].innerText = clienteAtual.estabelecimento.atividade_principal.descricao;
      $("#porte")[0].innerText = clienteAtual.porte.descricao;
      $("#capital")[0].innerText = clienteAtual.capital_social.toLocaleString('pt-br', {minimumFractionDigits: 2});




      let txtSoc = '<div class="content-section-title">Quadro societário</div><ul> ';



      clienteAtual.socios.forEach((socio) => {
          txtSoc = txtSoc  + '<li class="adobe-product"><div class="products">' + socio.nome + '</div><span class="status"><span class="status-circle green"></span> ' 
                          + socio.qualificacao_socio.descricao + '</span></li> ';
      })
      txtSoc = txtSoc + "</ul></div>";

      document.getElementById("quadrosocios").innerHTML=txtSoc;


      console.log("Passou pelo carrega cliente");
      if ($("#razao")[0].innerText != '' && $("#razao")[0].innerText != null) {
        console.log('$("#razao")[0].innerText ' + $("#razao")[0].innerText);
          carregaEmpodera($("#cnpj")[0].innerText.split("/")[0]);
      }

}



function carregaEmpodera(nome) {
  console.log("carregaEmpodera")
  
  buscaEmpodera(nome).then(jsonData => {

    
      if (divEmpodera != null) {
        $("#TOTVS")[0].innerHTML = divEmpodera;
      }
      console.log("é agoraaaaaaa!!!!!");
      console.log(jsonData);
      $("#codigot")[0].innerText = 'CódigoT: ' + jsonData[0].codT + ' - ' + jsonData[0].name;
      $("#assinatura")[0].innerText = new Intl.DateTimeFormat(['ban', 'id']).format(new Date(jsonData[0].lifetime.firstSign));
      $("#churn")[0].innerText = (Number.parseFloat(jsonData[0].healthscore.carol.result)*100).toFixed(2) + '%';
      
      try {
        $("#nps")[0].innerText = jsonData[0].healthscore.empoderaArea.measures.nps.total;
      } catch (err) {console.log("Zicou aqui!!! " + err)}
      montaTabelaContatos(jsonData);
      montarTabelaOfertasSugeridas(jsonData);

      }).catch(error => {
        divEmpodera = $("#TOTVS")[0].innerHTML;
          console.log(error);
          $("#TOTVS")[0].innerHTML = noInfoAvail("Cliente não localizado na Base TOTVS");
          throw('Erro empodera!' + error);
          

      });

}





function buscaEmpodera(nome) {
  return new Promise((resolve, reject) => {
    let method = "POST";
    let urlaBusca = nome;  
    console.log("buscaEmpodera " + nome);
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    let raw = JSON.stringify({
                    "busca" : nome
                });
    
      let requestOptions = {
            method: method,
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
          };

      fetch('/dadosEmpodera/', requestOptions)
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



function buscaTrafego() {
  const SIMILARWEB_BASE_URL = 'https://data.similarweb.com/api/v1/data?domain='
  const corsServer = 'https://cors.smlpoints.workers.dev'
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

      //fetch('/trafego/', requestOptions)
      fetch(corsServer + '/?' + SIMILARWEB_BASE_URL + urlaBusca.value, {})
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
            offsetY: 10,
            size: '25%'
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
             width: 40
            
            },
            legend: {
              position: 'top'
            }
          }
        }]
        };

        var chart = new ApexCharts(document.querySelector("#chart"), options);
        chart.render(); 
        
        

        const map1 = new Map(Object.entries(result.EstimatedMonthlyVisits));
        let data = [];
       

        Object.entries(result.EstimatedMonthlyVisits).map(obj => {
          console.log(obj);
          var obj = {
                      x: obj[0],
                      y: obj[1]
                    }
          data.push(obj);
        }); 

   

        var options2 = {
          series: [{
          name: 'Acessos últimos 3 meses',
          data: data
        }],
          chart: {
          height: 150,
          type: 'bar',
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: '60%'
          },
        },
        stroke: {
          width: 0,
        },
        dataLabels: {
          enabled: false
        },
        yaxis: {
          labels: {
            formatter: function(val) {
              return val / 1000
            }
          }
        },
        fill: {
          opacity: 1,
        },
        xaxis: {
          type: 'datetime'
        }
        };

        var options2 = {
          series: [{
          name: 'Visitas',
          data: Object.values(result.EstimatedMonthlyVisits)
        }],
          chart: {
          height: 220,
          type: 'bar',
        },
        plotOptions: {
          bar: {
            borderRadius: 10,
            dataLabels: {
              position: 'top', // top, center, bottom
            },
          }
        },
        dataLabels: {
          enabled: true,
          formatter: function (val) {
            return val ;
          },
          offsetY: -20,
          style: {
            fontSize: '12px',
            colors: ["#304758"]
          }
        },
        
        xaxis: {
          categories: ["Fevereiro", "Março", "Abril"], //Object.keys(result.EstimatedMonthlyVisits),
          position: 'top',
          axisBorder: {
            show: false
          },
          axisTicks: {
            show: false
          },
          crosshairs: {
            fill: {
              type: 'gradient',
              gradient: {
                colorFrom: '#D8E3F0',
                colorTo: '#BED1E6',
                stops: [0, 100],
                opacityFrom: 0.4,
                opacityTo: 0.5,
              }
            }
          },
          tooltip: {
            enabled: true,
          }
        },
        yaxis: {
          axisBorder: {
            show: false
          },
          axisTicks: {
            show: false,
          },
          labels: {
            show: false,
            formatter: function (val) {
              return val;
            }
          }
        
        },
        title: {
          text: 'Acessos dos ultimos 3 meses',
          floating: true,
          offsetY: 330,
          align: 'center',
          style: {
            color: '#444'
          }
        }
        };

        var chart2 = new ApexCharts(document.querySelector("#chartMonths"), options2);
        chart2.render();


                      
  }).catch(error => {
      console.log(error);
      throw('Erro ' + error);

});

}

function mostraTecnologias(){

 
  $(".content-wrapper").each(function() { 
    console.log('$(this)[0].id ' + $(this)[0].id);
	if ($(this)[0].id == 'tecnologias') {
    console.log("Vai mostrar!!!!");
		$(this).show(); 
	} else {
		$(this).hide();
    }		
	
	
  })


}

function montarTabelaOfertasSugeridas(data) {

if (data[0].opportunities == null) return;

  var html = [];

  html.push('<div class="content-section" >');
  html.push('<div class="content-section-title">Ofertas Indicadas</div>');
  html.push('<ul>');

for (let icont = 0; icont < data[0].opportunities.data.length; icont++) {
        let oportunidade = data[0].opportunities.data[icont];
        html.push('<li class="adobe-product">');
        html.push('<div class="products">');
        html.push('&nbsp');
        html.push(oportunidade.recommendation);
        html.push('</div>');
        /*html.push('<span class="status">');
        html.push('<span class="status-circle"></span>');
        html.push(oportunidade.brand);
        html.push('</span>');*/
        html.push('<div class="button-wrapper">');
        html.push('<button class="content-button status-button">Detalhes</button>');
        html.push('<div class="pop-up">');

        html.push('<div class="pop-up__title">');
        html.push(oportunidade.recommendation);
        html.push('<svg class="close" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x-circle">');
        html.push('<circle cx="12" cy="12" r="10" />');
        html.push('<path d="M15 9l-6 6M9 9l6 6" />');
        html.push('</svg>');
        html.push('</div>');
        html.push('<div class="pop-up__subtitle">');
        html.push(oportunidade.recommendation);
        html.push('<a href="#">Learn more</a></div>');
        html.push('<div class="checkbox-wrapper"><label>');
        html.push('Grupo de oferta: ' + oportunidade.offerGroup);
        html.push('</label></div>');

        html.push('<div class="checkbox-wrapper"><label>');
        html.push('Ticked Médio: R$ ' + oportunidade.avgticketprice);
        html.push('</label></div>');
       
        html.push('<div class="checkbox-wrapper"><label>');
        html.push('Tempo para contato: ' + oportunidade.contactMonth);
        html.push('</label></div>');
        
        html.push('<div class="checkbox-wrapper"><label>');
        html.push('Tipo de oferta: ' + oportunidade.type);
        html.push('</label></div>');
        
        html.push('<div class="content-button-wrapper">');
        html.push('<button class="content-button status-button open close">OK</button>');
        html.push('</div>');
        html.push('</div></li>');      

}

  html.push('</ul></div></div>');
  $("#ofertasSugeridasEmpodera")[0].innerHTML = html.join("");
  
  
}

async function fetchRegistroBr(inputAddress) {

  let urlHost = new URL(inputAddress);
  const registroBR_URL = 'https://rdap.registro.br/domain'
  let result = {}

  return new Promise((resolve, reject) => {
    console.log(registroBR_URL + '/' + urlHost.host);
    fetch(registroBR_URL + '/' +  urlHost.host)
      .then((response) => {
        console.log(response)
        if (!response.ok) return resolve(result)
        return response.json();
      }).then((jsonData) => {
        console.log(jsonData)
        result = jsonData
        console.log(result);		
        let cnpj = [result.entities[0].publicIds[0].identifier];
        let num = cnpj[0].replace(/\D/g,'').substring(0,14);
		    resolve(result)
      }).catch((err) => {
        
		    console.log("erro da parada")  
        console.log(err)
        reject(err)
        //throw err
		
      });
  })
}

function noInfoAvail(mensagem) {
  let html = [];
  html.push('<table  width="100%" height="100%"><tr><td align="center"><h3 class="menu-link-main">')
  html.push(mensagem)
  html.push('</h3></td></tr></table>');

  return html.join("");



}