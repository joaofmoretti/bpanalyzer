const Wappalyzer = require('wappalyzer')
let express = require('express');
let bodyParser = require('body-parser');
let app = express();

const { application } = require('express');
const { json } = require('body-parser');

app.use(bodyParser.json());
app.use(express.static(__dirname));
app.use(express.static(__dirname + '\\views\\form.html'));
app.use(express.static(__dirname + '\\views\\styleforms.css'));
app.use(express.static(__dirname + '\\views\\form.js'));
app.use(express.static(__dirname + '\\views\\totvs-logob.png'));
console.log(__dirname);
app.use(express.static(__dirname + '\\views\\login.html'));
app.use(express.static(__dirname + '/views/stylelogin.css'));
app.use(express.static(__dirname + '/views/totvs-logob.png'));

const registroBR_URL = 'https://rdap.registro.br/domain'

const isValidUrl = urlString=> {
    var urlPattern = new RegExp('^(https?:\\/\\/)?'+ // validate protocol
  '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // validate domain name
  '((\\d{1,3}\\.){3}\\d{1,3}))'+ // validate OR ip (v4) address
  '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // validate port and path
  '(\\?[;&a-z\\d%_.~+=-]*)?'+ // validate query string
  '(\\#[-a-z\\d_]*)?$','i'); // validate fragment locator
return !!urlPattern.test(urlString);
}

let respostaGlobal;
let dadosGoverno;

let router = express.Router();
app.use("/form/",router);
app.use("/login/",router);
let encodeUrl = bodyParser.urlencoded({ extended: false });

let url = 'https://www.wappalyzer.com'

const options = {
  debug: false,
  delay: 500,
  headers: {},
  maxDepth: 3,
  maxUrls: 10,
  maxWait: 10000,
  recursive: true,
  probe: true,
  proxy: false,
  userAgent: 'Wappalyzer',
  htmlMaxCols: 2000,
  htmlMaxRows: 2000,
  noScripts: false,
  noRedirect: false,
};

const wappalyzer = new Wappalyzer(options)

app.get('/dadosGoverno/', (req, res) => {
  
  res.end(JSON.stringify(dadosGoverno));

});

app.get('/login/', (req, res) => {
    res.sendFile(__dirname + '/views/login.html');
}); 

app.get('/form/styleforms.css', (req, res) => {
    res.sendFile(__dirname + '\\views\\styleforms.css'); 
});

app.get('/form/styleasteroid.css', (req, res) => {
    res.sendFile(__dirname + '\\views\\styleasteroid.css'); 
});



app.get('/form/form.js', (req, res) => {
    res.sendFile(__dirname + '\\views\\form.js'); 
});

app.get('/login/totvs-logob.png', (req, res) => {
    res.sendFile(__dirname + '\\views\\totvs-logob.png'); 
});

app.listen(5001, () => {
    console.log("Aplicação de subiu na porta 5001");
});

app.post('/login/', encodeUrl, (requisicao, resposta) => {

    var usuario = requisicao.body.usuario;
    url = usuario;

    if (isValidUrl(url)) {
      respostaGlobal=resposta;
       prospectar(url);

       
       
        
        
    } else {
        resposta.send("<script>alert('Endereço inválido!'); history.go(-1);</script>");
       
    }

    
});

app.get('/form/', (req, res) => {
  res.append('Warning', '199 Miscellaneous warning 1111')
    res.sendFile(__dirname + '\\views\\form.html');
    res.append('Warning', '199 Miscellaneous warning 2222')
    //es.send("<script>alert('teste');</script>");
    

    console.log('get do form');
   
    

});

function prospectar(url) {
    console.log("prospectando")
   let retorno = fetchRegistroBr(url);
   
  
    
 
}    


async function wappalyzerCliente(url) {
  
  
  
  
  try {
    await wappalyzer.init()

    // Optionally set additional request headers
    const headers = {}

    // Optionally set local and/or session storage
    const storage = {
      local: {}
      
    }

    const site = await wappalyzer.open(url, headers, storage)

    // Optionally capture and output errors
    site.on('error', console.error)

    const results = await site.analyze()

    console.log(JSON.stringify(results, null, 2))
  } catch (error) {
    console.error(error)
  }

  


  await wappalyzer.destroy()
}


async function getData(inputAddress) {
    const url = registroBR_URL + '/' + inputAddress;
    const response = await fetch(url);
    const jsonResponse = await response.json();
    console.log(jsonResponse);
  } 


async function fetchRegistroBr(inputAddress) {

  let urlHost = new URL(inputAddress);

  let result = {}

  return new Promise((resolve, reject) => {
    console.log(registroBR_URL + '/' + urlHost.host);
    fetch(registroBR_URL + '/' +  urlHost.host)
      .then((response) => {
        if (!response.ok) return resolve(result)
        return response.json();
      }).then((jsonData) => {
        result = jsonData
		console.log(result);		
		let cnpj = [result.entities[0].publicIds[0].identifier];
		let num = cnpj[0].replace(/\D/g,'').substring(0,14);
		
		if (num.length >= 14)  {
		
			extractsCNPJ(cnpj);
		} else {
			
		}	
        resolve(result)
      }).catch((err) => {
		console.log("erro da parada");  
        console.log(err);
		
		
      });
  })
}


const SIMILARWEB_BASE_URL = 'https://data.similarweb.com/api/v1/data?domain='
const corsServer = 'https://cors.smlpoints.workers.dev'


function fetchSimilarWeb(inputAddress) {
  let result = {}
  return new Promise((resolve, reject) => {
    fetch(`${corsServer}/?${SIMILARWEB_BASE_URL}${inputAddress}`, {})
      .then((response) => {
        if (!response.ok) return resolve(result)
        return response.json();
      }).then((jsonData) => {
        result = jsonData
				
		document.getElementById("visitas").value=Math.ceil(result.Engagments.Visits).toLocaleString();
		document.getElementById("taxa").value=(Number.parseFloat(result.Engagments.BounceRate)*100).toFixed(2) + '%';
		document.getElementById("paginas").value=Number.parseFloat(result.Engagments.PagePerVisit).toFixed(2);
		document.getElementById("tempo").value=Number.parseFloat((result.Engagments.TimeOnSite/60)).toFixed(2);
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
		
		

        resolve(result)
      }).catch((err) => {
        console.log(err);
      });
  })
}

function extractsCNPJ(resultsArray){
    console.log("Chegou aqui");
    console.dir(resultsArray);
    console.log(resultsArray[0]);
    let cnpjValue = resultsArray[0].replace(/\D/g,'').substring(0,14);
    let numeroCNPJ = resultsArray[0].replace(/\D/g,'').substring(0,14);
    cnpjValue = cnpjValue.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
    
    console.log("Numero cnpj " + numeroCNPJ);
    //document.getElementById("cnpj").value=cnpjValue;
    
    let dados = null;
    let urlGover = 'https://publica.cnpj.ws/cnpj/' + numeroCNPJ.toString();
    fetch(urlGover)
    // Tratamento do sucesso
    .then(response => response.json())  // converter para json
    .then(json => {populadadosGoverno(json);})    //imprimir dados no console
    .catch(err => console.log('Erro de solicitação', err));
    
    
}

function populadadosGoverno(json) {
    console.log("Dados governo");
    console.log(json);
    dadosGoverno = json;
    respostaGlobal.redirect('/form/');
 
    
   
    //respostaGlobal.send("<script>setaCampo('nome', " +  json.razao_social +  ");</script>");
    /*if (json.razao_social != undefined) {
        
        let txtSoc = '<table width="100%" border=1><tr><td align=center><b>Nome</b></td><td align=center><b>Cargo</b></td></tr> ';
        
        json.socios.forEach((socio) => {
            txtSoc = txtSoc  + '<tr><td>' + socio.nome + '</td><td> ' + socio.qualificacao_socio.descricao + '</td></tr> ';
        })
        txtSoc = txtSoc + "</table>";
        
        document.getElementById("razao").value=json.razao_social;
    
        document.getElementById("atividade").value=json.estabelecimento.atividade_principal.descricao
        document.getElementById("cidade").value=json.estabelecimento.cidade.nome
        document.getElementById("estado").value=json.estabelecimento.estado.nome
        document.getElementById("socios").innerHTML=txtSoc
    }	*/
        
}