const Wappalyzer = require('wappalyzer')
const {execFile} = require('child_process');
const cors = require('cors');

//const fs = require('fs');
//const key = fs.readFileSync('./ca/servidor.decrypted.key');
//const cert = fs.readFileSync('./ca/servidor.crt');

//const https = require('https');

let express = require('express');
let bodyParser = require('body-parser');
let app = express();
app.use(cors());
const { application } = require('express');
const { json } = require('body-parser');

app.use(bodyParser.json());
app.use(express.static(__dirname));
app.use(express.static(__dirname + '/views/form.html'));
app.use(express.static(__dirname + '/views/styleforms.css'));
app.use(express.static(__dirname + '/views/form.js'));
app.use(express.static(__dirname + '/views/totvs-logob.png'));
//console.log(__dirname);
app.use(express.static(__dirname + '/views/login.html'));
app.use(express.static(__dirname + '/views/stylelogin.css'));
app.use(express.static(__dirname + '/views/totvs-logob.png'));

const registroBR_URL = 'https://rdap.registro.br/domain'
let tituloPagina = "Titulo da página não encotrado";

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
let pagina = {
               "url" : "url",
               "title": "title",
               "cnpj" : ""
}

let router = express.Router();
app.use("/app/",router);
app.use("/calc/",router);
let encodeUrl = bodyParser.urlencoded({ extended: false });

let url = 'https://www.wappalyzer.com'

const options = {
  debug: false,
  delay: 500,
  headers: {},
  maxDepth: 3,
  maxUrls: 1,
  maxWait: 30000,
  recursive: true,
  probe: true,
  proxy: false,
  userAgent: 'Wappalyzer',
  htmlMaxCols: 2000,
  htmlMaxRows: 2000,
  noScripts: false,
  noRedirect: false,
};

const { exec } = require("child_process");
const { throws } = require('assert');


const parsePage = (body, url) => {
  let match = body.match(/<title>([^<]*)<\/title>/)  // regular expression to parse contents of the <title> tag

  if (!match || typeof match[1] !== 'string') {
    match = body.match(/<title data-react-helmet="true">([^<]*)<\/title>/)
  }  



  if (!match || typeof match[1] !== 'string') {
    console.log('Unable to parse the title tag');
    throw new Error('Unable to parse the title tag')
  }
  tituloPagina = match[1];
  console.log('match[1] ' + match[1])

  let cnpj = ''
  try {
    cnpj = body.match(/\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}/)[0];
  } catch (err) {}
  if (cnpj != '') {
    console.log('cnpjX ' + cnpj);
    
  } else {
    console.log('cnpjX nao achou');
  }

  pagina.url = url
  pagina.title = tituloPagina
  pagina.cnpj = cnpj

  return pagina
}

app.post('/webhook/', encodeUrl, (requisicao, resposta) => {
  console.log("webhoook------------------------------------------")
  console.log(requisicao.body)
  let nomeEmpresa = data?.JSON?.payload.questions_and_answers.find((q) => q.question == 'Empresa').answer;
  let escopo = data?.JSON?.payload.questions_and_answers.find((q) => q.position == 4).answer;
  let apresentador = retornaApresentador(data?.JSON);
  let telefoneCliente = data?.JSON?.payload.questions_and_answers.find((q) => q.question == 'Celular do Cliente').answer;
  let nomeCliente = data?.JSON?.payload.questions_and_answers.find((q) => q.position == 1).answer;
  let nomeUnidade = data?.JSON?.payload.questions_and_answers.find((q) => q.position == 5).answer;
  let oferta = data?.JSON?.payload.scheduled_event.name.toUpperCase().replace('E-COMMERCE B2B', '');




  let url = 'https://crm.rdstation.com/api/v1/organizations?token=6303f05b46f5b6001b61b603';
  let options = {
    method: 'POST',
    headers: {accept: 'application/json', 'content-type': 'application/json'},
    body: JSON.stringify({organization: {name: nomeEmpresa}})
  };

  fetch(url, options)
  .then(res => res.json())
  .then(json => resposta.status(201).send(json))
  .catch(err => resposta.status(401).send(err));
  

  ;
})


app.post('/login/', encodeUrl, (requisicao, resposta) => {
  console.log("Loginn------------------------------------------")
  console.log(requisicao.body)
 
    
  let respostas = requisicao.body.payload.questions_and_answers;

  if (respostas != null && respostas.length > 0) {
    console.log("respostasl.length " + respostas.length );
  }

  for (let cont=0; cont < respostas.length; cont++) {
    console.log(respostas[cont]);
    console.log(respostas[cont].question + " " + respostas[cont].answer + " " + respostas[cont].position)
  }

  
  resposta.status(201).send('requisicao.body.answer ' + requisicao.body.answer);
});

  


app.get('/login/', (req, res) => {

  res.writeHead(200, {"Content-Type": "application/json"});
    res.end(JSON.stringify(bag));
  //res.sendFile(__dirname + '/views/login.html');
}); 

app.get('/teste/', (req, res) => {
  try {
    
    console.log(requisicao.body)
    esposta.status(201).send('requisicao.body.answer ' + requisicao.body.answer);




  }
  catch (error) {
    console.error(error)
    res.status(404). send(error);
  }
}); 

app.get('/form/styleforms.css', (req, res) => {
    res.sendFile(__dirname + '/views/styleforms.css'); 
});

app.get('/styleapp.css', (req, res) => {
    res.sendFile(__dirname + '/views/styleapp.css'); 
});
app.get('/scriptapp.js', (req, res) => {
  res.sendFile(__dirname + '/views/scriptapp.js'); 
});

app.get('/apexcharts.min.js', (req, res) => {
  res.sendFile(__dirname + '/views/apexcharts.min.js'); 
});

app.get('/bishop-94180.mp4', (req, res) => {
  res.sendFile(__dirname + '/views/bishop-94180.mp4'); 
});

app.get('/icon_38.png', (req, res) => {
  res.sendFile(__dirname + '/views/icon_38.png'); 
});

app.get('/', (req, res) => {
  
  res.sendFile(__dirname + '/views/app.html');
});

app.get('/site/:site', (req, res) => {
  console.log("NOvo construtor!!!");
  console.log(req.params);

  let sitedoPlugin = decodeURIComponent(req.params);

  res.redirect('/');

  res.send("<script>alert('Usuário ou senha inválidos!'); history.go(-1);</script>");

  //res.sendFile(__dirname + '/views/app.html');
});

app.get('/calc/', (req, res) => {
  
  res.sendFile(__dirname + '/views/calc.html');
});

app.get('/app/', (req, res) => {
  
    res.sendFile(__dirname + '/views/app.html');
});

app.get('/form/form.js', (req, res) => {
    res.sendFile(__dirname + '/views/form.js'); 
});

app.get('/totvs-logob.png', (req, res) => {
    res.sendFile(__dirname + '/views/totvs-logob.png'); 
});

app.get('/VTEX.svg', (req, res) => {
  res.sendFile(__dirname + '/views/VTEX.svg'); 
});

app.get('/Tail.svg', (req, res) => {
  res.sendFile(__dirname + '/views/Tail.svg'); 
});

app.get('/Shopify.svg', (req, res) => {
  res.sendFile(__dirname + '/views/Shopify.svg'); 
});

app.get('/RDStation.png', (req, res) => {
  res.sendFile(__dirname + '/views/RDStation.png'); 
});

app.listen(process.env.PORT || 3000, () => {
    console.log("Aplicação de subiu na porta 3000");
});

//const server = https.createServer({ key, cert }, app);

//const port = 3000;
//server.listen(port, () => {
  //console.log('Servidor está rodando com https na porta 3000');
//});


app.get('/form/', (req, res) => {
  res.append('Warning', '199 Miscellaneous warning 1111')
    res.sendFile(__dirname + '/views/form.html');
    res.append('Warning', '199 Miscellaneous warning 2222')
    //es.send("<script>alert('teste');</script>");
    

    console.log('get do form');
   
    

});

  

function cleanCompanyName(texto) {

  let nome = texto.toLowerCase();

  let palavras = ['s/a', 'sa', 's a', 'ltda', 'eireli', 's.a.', ' industria e comercio'];

  for (var icont=0; icont < palavras.length; icont++) {
      nome = nome.replace(palavras[icont], '');
  }

  return nome;


}

app.post('/dadosEmpodera/', encodeUrl, (req, res) => {


  let nome  = req.body.busca;
  let clienteCNPJRegistroBR = BuscaClienteEmpodera(nome);
  let requestOptions = getEmpoderaResquetHeader();
  
  
  clienteCNPJRegistroBR.then(result => { 
                console.log("Resultado empodera!!!")
                //console.log(result)
                let clientesLocalizados = result;
               
                if (clientesLocalizados == null || clienteCNPJRegistroBR.length == 0  ) {
                  
                  //throw new Error('Customer not Found with search ' + nome);
                  console.log("Vai tentar com outro cnpj: " + nome) 
                  let clienteCNPJSite = BuscaClienteEmpodera(nome);
                  clienteCNPJSite.then(resultado => {
                    console.log("!!!!!Rodando esta localizacao");
                    clientesLocalizados = resultado;
                  })

                }
                 
                console.log("Cliente que vai retornar");
                //console.log(clientesLocalizados);

                if (clientesLocalizados != null && clientesLocalizados.length != 0) {

                  let urlOportunidades = [];
                  urlOportunidades.push(' https://empodera.totvs.com/api/area/totvs/opportunities/customer/')
                  urlOportunidades.push(clientesLocalizados[0].codT);
                  urlOportunidades.push('/list?all=true&page=1&perPage=10&coin=BRL');
                
                  fetch(urlOportunidades.join(""), requestOptions)
                      .then(responseOps => responseOps.text())
                      .then(resultOps => {
                        let oportunidadesLocalizadas = JSON.parse(resultOps);
                        
                        clientesLocalizados[0].opportunities = oportunidadesLocalizadas;


                        let urlContatos = [];
                        urlContatos.push('https://empodera.totvs.com/api/area-shared/totvs/contact?codT=')
                        urlContatos.push(clientesLocalizados[0].codT);
                        urlContatos.push('&perPage=100');
                      
                        fetch(urlContatos.join(""), requestOptions)
                            .then(responseContatos => responseContatos.text())
                            .then(responseContatos => {
                              let contatosLocalizadas = JSON.parse(responseContatos);
                              
                              clientesLocalizados[0].contacts = contatosLocalizadas;

                              res.status(201). send(clientesLocalizados);
                              
                            }).catch(error => {console.log('error', error)} );
                      }).catch(error => {console.log('error', error)} );
                } else {
                   throw new Error("Cliente nao localizado no empodera");             
                }
                    

                

  
}).catch(error => {console.log('error', error); res.status(404). send();} );
})

app.post('/wservice/', encodeUrl, (req, res) => {
  
  
  url = req.body.busca;
  console.log(req.body);

  url = url.toLowerCase();

  if (url.indexOf('http') == -1) {
    url = 'https://' + url;
  }

  console.log("Wservice URL " + url + ' ' + Date());

 
  
  try {

    const wappalyzer = new Wappalyzer(options)
    wappalyzer.init()
    // Optionally set additional request headers
    const headers = {}

    // Optionally set local and/or session storage
    const storage = {
      local: {}
      
    }

    const site = wappalyzer.open(url, headers, storage)
    // Optionally capture and output errors
    //site.on('error', console.error)

    site.then((a) => {
     const results = a.analyze()
      results.then((obj) => {
        
        fetch(url)
          .then(resp => resp.text()) // parse response's body as text
          .then(body => parsePage(body, url)) // extract <title> from body
          .then(page => { obj.title = page.title;
                          obj.cnpjSite = page.cnpj;
                           obj.totvsOffers = geraOfertasTOTVS(obj);
                           obj.ecommerce = geraEcommerce(obj).toString() ;
                           
                          res.status(201). send(obj);
                         }) // send the result back
          .catch(e => { 
            //obj.totvsOffers = geraOfertasTOTVS(obj);
            //obj.ecommerce = geraEcommerce(obj).toString() ;
            console.log('erro da busca de pagina');
            console.log(e);
            res.status(404). send("Erro de busca da pagina");
           }) // catch possible errors
         
          })   
   }).catch(e => { 
                    console.log("Erro de Analize Wappalyzer")
                    console.log(e)
  
                    })   
 
    
  } catch (error) {
    console.log("Erro da prospecção inteira")
    console.error(error)
    res.status(404).send("erro de prospecção");
  }

  


  
})


app.post('/prospectaSite/', encodeUrl, (req, res) => {
  
  
  url = req.body.busca;
  console.log(req.body);

  url = url.toLowerCase();

  if (url.indexOf('http') == -1) {
    url = 'https://' + url;
  }

  console.log("propsectaSite URL " + url + ' ' + Date());


 
  
  try {

    
              
        var cabecalho = new Headers();
        cabecalho.append("Content-Type", "application/json");

        var raw = JSON.stringify({
          "busca": url
        });

        var opcoesDeRequisicao = {
          method: 'POST',
          headers: cabecalho,
          body: raw,
          redirect: 'follow'
        };

        fetch("http://179.223.166.224:3000/wservice", opcoesDeRequisicao)
        .then(response => response.json())  // converter para json
        .then(json => {res.send(json);})    //imprimir dados no console
        .catch(err => console.log('Erro de solicitação', err));
         
             
    
  } catch (error) {
    console.log("Erro da prospecção inteira")
    console.error(error)
    res.status(404).send("erro de prospecção");
  }

  


  
})

app.post('/apenasdadosGoverno/', encodeUrl,   (req, res) => {
  var busca = req.body.busca;;
  let num = busca;
console.log('apenasdadosGoverno ' + num);
let dados = null;
          let urlGover = 'https://publica.cnpj.ws/cnpj/' + num.toString();
          console.log("urlGover " + urlGover);
          fetch(urlGover)
          // Tratamento do sucesso
          .then(response => response.json())  // converter para json
          .then(json => {res.send(json);})    //imprimir dados no console
          .catch(err => console.log('Erro de solicitação', err));
})          

app.post('/dadosGoverno/', encodeUrl,   (req, res) => {

  var busca = req.body.busca;;
  let urlHost = new URL(busca);
  let cnpjEncontrado = ''
  let num = '';
  let result = {}
  console.log("Pagina !!!!!!!!!!!!!!!!!!!!!!!222222 " + url);
  let pageCNPJ = fetch(url)
          .then(resp => resp.text()) // parse response's body as text
          .then(body => parsePage(body, url)) // extract <title> from body
          .then(pagina => { 
            if (pagina != null && pagina.cnpj != "") {
              cnpjEncontrado = pagina.cnpj;
              num = cnpjEncontrado.replace(/\D/g,'').substring(0,14);
              if (num.length >= 14)  {
                  let urlGover = 'https://publica.cnpj.ws/cnpj/' + num.toString();
                  //let urlGover = 'https://publica.cnpj.ws/cnpj/' + num.toString();
                console.log("urlGover sem passar pelo RegistroBR" + urlGover);
                fetch(urlGover)
                // Tratamento do sucesso
                .then(response => response.json())  // converter para json
                .then(json => {res.send(json); })    //imprimir dados no console
                .catch(err => console.log('Erro de solicitação', err));
                
              }
          
            }

            

          }) // send the result back
          .catch(e => { console.log(e)})


  pageCNPJ.then((result) => {

      console.log('cnpjEncontrado ' + cnpjEncontrado)
      if (cnpjEncontrado != '') return;
      let registro = fetchRegistroBr(busca);
      registro.then((result) => {
    
        try{
          cnpjEncontrado = [result.entities[0].publicIds[0].identifier];
          num = cnpjEncontrado[0].replace(/\D/g,'').substring(0,14);
        } catch (erro) {
          console.log("Não foi possível pegar o CNPJ do domímio");
          console.log(result)
        }  
        if (num.length >= 14)  {
      
          let dados = null;
          let urlGover = 'https://publica.cnpj.ws/cnpj/' + num.toString();
          console.log("urlGover " + urlGover);
          fetch(urlGover)
          // Tratamento do sucesso
          .then(response => response.json())  // converter para json
          .then(json => {res.send(json);})    //imprimir dados no console
          .catch(err => console.log('Erro de solicitação', err));
          
        }
      }).catch(erroRegistro => {console.log("erro na requisicao que recupera o Registro"); console.log(erroRegistro)});
    }).catch(erroCNPJ => {console.log("erro na requisicao que recupera o cnpj"); console.log(erroCNPJ)})    
})
  

function getEmpoderaResquetHeader() {
  var myHeaders = new Headers();
  myHeaders.append("accept", "application/json");
  myHeaders.append("authorization", "Basic SXNCaUpXWUpWdzpTVkZ4Ym1FdGJtbzRXR00wTUd0VVdFNWpRbU53ZFRkS2JHaE9SV2RpUm1waGQwazFVRXhVZEVvNGVsUmZXbmMx");

  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };

  return requestOptions;
}

async function BuscaClienteEmpodera(nome) {


  if ( nome == null || nome == '') {
    //return;
    //throw new Error('Cnpj nao encontrado para o empodera');
  }

  console.log("BuscaClienteEmpodera " + nome)

  let urlEmpodera = [];
  urlEmpodera.push("https://empodera.totvs.com/api/area/totvs/customers-data/search?customer=");
  urlEmpodera.push(nome);
  urlEmpodera.push("&status=Ativo&healthscoreType=totvs&mrr=&tickets=&report=false&take=15&skip=0&currentPage=1&perPage=10&sortAc=true&oportunity=all");
  
  let requestOptions = getEmpoderaResquetHeader();
  console.log(urlEmpodera.join(""));
  return new Promise((resolve, reject) => {
    fetch(urlEmpodera.join(""), requestOptions).then((response) => {
     
      if (!response.ok) return resolve(response)
      return response.json();
    }).then((jsonData) => {
      console.log("BuscaClienteEmpodera deu bom!")
      let result = jsonData
     
      resolve(result)
    }).catch((err) => {
      console.log("Erro ao tentar buscar dados do Empodera")  
      console.log(err)
      reject(err)
      //throw err
  
    });
  })


}  



async function fetchRegistroBr(inputAddress) {

  let urlHost = new URL(inputAddress);

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

app.post('/trafego/concorrentes/', encodeUrl,   (req, res) => {


const spyfu_BASE_URL = 'https://www.spyfu.com/NsaApi/Competitors/GetPaidAndOrganicTopCompetitors?countryCode=BR&domain='
var busca = req.body.busca;;
  let urlHost = new URL(busca);
  let result = {}
  return new Promise((resolve, reject) => {
    fetch(spyfu_BASE_URL + urlHost)
      .then((response) => {
        if (!response.ok) return resolve(result)
        return response.json();
      }).then((jsonData) => {
        result = jsonData
        res.send(jsonData);
        resolve(result)
      }).catch((err) => {
        console.log(err);
      });  

})

})  



app.post('/trafego/', encodeUrl,   (req, res) => {

   const SIMILARWEB_BASE_URL = 'https://data.similarweb.com/api/v1/data?domain='
   const corsServer = 'https://cors.smlpoints.workers.dev'

  var busca = req.body.busca;;
  let urlHost = new URL(busca);
  let result = {}
  return new Promise((resolve, reject) => {
    fetch(corsServer +'/?' + SIMILARWEB_BASE_URL + urlHost)
      .then((response) => {
        console.log("resposta similar Web");
        console.log(response);
        console.log("response.ok");
        console.log(response.ok)


        if (!response.ok) return resolve(result)
        return response.json();
      }).then((jsonData) => {
        result = jsonData
        console.log("Moretti greatest hit ?")
        console.log(result)
        res.status(200).send(jsonData);
        resolve(result)
      }).catch((err) => {
        console.log("Erro ao buscar trafego");
        res.status(404).send(err);
        console.log(err);
      });  

})  
})




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
    //console.dir(resultsArray);
    //console.log(resultsArray[0]);
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
    //respostaGlobal.redirect('/form/');
 
    
   
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

function geraOfertasTOTVS(obj) {
  let totvsSlurs = [ 'rd-station', 'tail' ,'shopify'];
  let totvsOffers = [];


  for (var icont=0; icont < obj.technologies.length; icont++) {

    if (totvsSlurs.includes(obj.technologies[icont].slug)) {

      totvsOffers.push(obj.technologies[icont]);
    }

  }

  return totvsOffers;
}

function geraEcommerce(obj) {
  let totvsSlurs = ['rd-station', 'tail' ,'shopify'];
  let ecoms = [];


  for (var icont=0; icont < obj.technologies.length; icont++) {

    if (obj.technologies[icont].categories[0].id == 6) {
      
            ecoms.push(obj.technologies[icont].name);
        
    }

  }

  if (ecoms.length == 0) {
    ecoms.push("Não detectada");
  }

  return ecoms;
}

