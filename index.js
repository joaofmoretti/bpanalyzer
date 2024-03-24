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
//console.debug(__dirname);
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
  maxWait: 40000,
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
    console.debug('Unable to parse the title tag');
    throw new Error('Unable to parse the title tag')
  }
  tituloPagina = match[1];
  console.debug('match[1] ' + match[1])

  let cnpj = ''
  try {
    cnpj = body.match(/\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}/)[0];
  } catch (err) {}
  if (cnpj != '') {
    console.debug('cnpjX ' + cnpj);
    
  } else {
    console.debug('cnpjX nao achou');
  }

  pagina.url = url
  pagina.title = tituloPagina
  pagina.cnpj = cnpj

  return pagina
}

let webhookbody;
let webhookresponse;

app.get('/webhook/response/', (req, res) => {

  res.writeHead(200, {"Content-Type": "application/json"});
    res.end(JSON.stringify(webhookresponse));
  //res.sendFile(__dirname + '/views/login.html');
}); 

app.get('/webhook/', (req, res) => {

  res.writeHead(200, {"Content-Type": "application/json"});
    res.end(JSON.stringify(webhookbody));
  //res.sendFile(__dirname + '/views/login.html');
}); 

async function obtemObjetoEmpresa(nome) {
      let nomeEmpresa = nome;
      console.log('nomeEmpresa ' + nomeEmpresa);
      return new Promise((resolve, reject) => {
      
      let url = 'https://crm.rdstation.com/api/v1/organizations?token=6303f05b46f5b6001b61b603';
      let opcoesEmpresa = {
        method: 'POST',
        headers: {accept: 'application/json', 'content-type': 'application/json'},
        body: JSON.stringify({organization: {name: nomeEmpresa}})
      };
    
      fetch(url, opcoesEmpresa)
      .then(res => res.json())
      .then(empresa => { if (empresa.errors != undefined && empresa.errors.name == 'Valor já existente.') {throw new Error()} 
                             else {
                             console.log("empresa nova criada");
                             resolve(empresa)
                             }})
      .catch((error) => {
        let opcoesBuscaEmpresa = {
          method: 'GET',
          headers: {accept: 'application/json', 'content-type': 'application/json'},
          
        };
  
        let urlBuscaEmpresa = 'https://crm.rdstation.com/api/v1/organizations?token=6303f05b46f5b6001b61b603&q='
             + nomeEmpresa + '&limit=200';
  
        fetch(urlBuscaEmpresa, opcoesBuscaEmpresa)
        .then(res => res.json())
        .then(empresasLocalizadas => { console.log("Empresas: " + empresasLocalizadas.organizations.length);
                                       let empresa = empresasLocalizadas.organizations.find((emp) => emp.name == nomeEmpresa); 
                                       
                                       //console.log("nova empresa"); console.log(empresa) 
                                       if (empresa == null) {empresa = empresasLocalizadas.organizations.filter((emp) => emp.name.toLowerCase().indexOf(nomeEmpresa) > -1)[0]}
                                      // if (empresa == null) {console.log("Deu coco")} else {console.log(empresa)}
                                      resolve(empresa);
                                       
                                      })
        .catch((Error) => {console.log("Nao criou nem achou"); reject(Error);})                               

      }).catch(erroEmpresa => {console.log("Erro na parada"); 
                             console.log(erroEmpresa)
                             reject(erroEmpresa);
                            
                            })
    })                        
}

app.post('/webhook/', encodeUrl, (requisicao, resposta) => {
  console.log("webhoook------------------------------------------")
  console.log(requisicao.body);
  webhookbody = requisicao.body;
  
  let nomeEmpresa = requisicao.body.payload.questions_and_answers.find((q) => q.question == 'Empresa').answer;
  let escopo = requisicao.body.payload.questions_and_answers.find((q) => q.position == 4).answer;
  let apresentador = retornaApresentador(requisicao.body);
  let origem = requisicao.body.payload.questions_and_answers.find((q) => q.position == 6).answer
  let telefoneCliente = requisicao.body.payload.questions_and_answers.find((q) => q.question == 'Celular do Cliente').answer;
  let nomeCliente = requisicao.body.payload.questions_and_answers.find((q) => q.position == 1).answer;
  let nomeUnidade = requisicao.body.payload.questions_and_answers.find((q) => q.position == 5).answer;
  let oferta = requisicao.body.payload.scheduled_event.name.toUpperCase().trim().replace('E-COMMERCE B2B', '');
  let cargoCliente = requisicao.body.payload.questions_and_answers.find((q) => q.position == 3).answer;
  let campaingId = '6532c91f3ae6b1000de593a5';
  let sourceId = '63651c290de1b20019712080';
  let emailRequisitante = requisicao.body.payload.email.toString().toLowerCase();
  let fonteRD = (origem == "RD STATION");
  let nomeAPN;

 console.debug("origem: " + origem);

  if (origem == "RD CONVERSAS") {
    sourceId = '6557bdc659db5d001c3c4684';
  } else if (origem == "EXACT SALES") {
    sourceId = '6557bdb23770f2001bb8b82e';
  } else if (origem == "TOTVS") {
    sourceId = '63651c290de1b20019712080';
  } else if (origem == "RD STATION") {
    sourceId = '6556783ed1f311000f84c37c';
  } else if (origem == "AGÊNCIAS") {
    sourceId = '6557bdb93770f2001bb8b83f';
  }

 

  if (fonteRD) {
      
      if (emailRequisitante == 'jonathan.lopes@rdstation.com') {
        nomeAPN = 'Jonathan Lopes (RD)';
      } else if (emailRequisitante == 'gabriela.cidade@rdstation.com') {
        nomeAPN = 'Gabriela Cidade (RD)';
      } else if (emailRequisitante == 'gabriel.calixto@rdstation.com') {
        nomeAPN = 'Gabriel Calixto (RD)';
      }
  } 
    

  let promessaEmpresa = obtemObjetoEmpresa(nomeEmpresa);

  promessaEmpresa.then(empresa => {
    
    console.log(empresa);
    let conteudobody = {
      campaign: {_id: campaingId},
      deal: {
        deal_stage_id: '651f23bc471bcb000d59202c',
        name: oferta + ' - ' + nomeEmpresa,
        rating: 2,
        user_id: apresentador.id,
        deal_custom_fields: [
          {custom_field_id: '63763ae8c62c24000cbc1032', value: oferta},
          {custom_field_id: '63505233968a250014767d55', value: nomeUnidade},
          {custom_field_id: '63ced2631bc670000ca81466', value: nomeAPN},
          {custom_field_id: '6544fe33f62610000d22077d', value: requisicao.body.payload.name},
          {custom_field_id: '641b4c5dba8773002266f528', value: new Date(requisicao.body.payload.scheduled_event.start_time).toLocaleDateString('pt-BR')},
          {custom_field_id: '63f8ced05edf4300218e297f', value: apresentador.name}
    
        ]
      },
      deal_source: {_id: sourceId},
      organization: {_id: empresa._id},
      contacts: [
        {
          //emails: [{email: requisicao.body.payload.email}],
          name: nomeCliente,
          title: cargoCliente,
          phones: [{type: 'cellphone', phone: telefoneCliente}]
        }
      ]
    };

    if (origem != "TOTVS") {
      conteudobody.deal.deal_custom_fields.push({custom_field_id: '64cd438ff3fc640014b2f5a5', value: "N/A"});
      conteudobody.deal.deal_custom_fields.push({custom_field_id: '6474edfabb0aba000da1378f', value: "NÃO"});
    }

    let opcoesOPeCom = {
      method: 'POST',
      headers: {accept: 'application/json', 'content-type': 'application/json'}
    };

    opcoesOPeCom.body = JSON.stringify(conteudobody);

    
  console.log("O que ele vai enviar para o RD =================");
  console.log(opcoesOPeCom.body)
  console.log("fim dO que ele vai enviar para o RD =================");
    

    url = 'https://crm.rdstation.com/api/v1/deals?token=6303f05b46f5b6001b61b603';
    fetch(url, opcoesOPeCom)
    .then(res => res.json())
    .then(oportunidade => { 
          console.log("resposta ");
          console.log(oportunidade);
          webhookresponse = oportunidade;
          opcoesOPeCom.body = JSON.stringify({
                            activity: {
                              deal_id: oportunidade._id,
                              text: escopo,
                              user_id: apresentador.id
                            }});

          url = 'https://crm.rdstation.com/api/v1/activities?token=6303f05b46f5b6001b61b603';                 
          
          fetch(url, opcoesOPeCom)
          .then(res => res.json())
          .then(comentario => { console.log(comentario); resposta.status(201).send()})})
          .catch(err => {console.log(err);  webhookresponse = err});

    })
    .catch(err => { console.log(err); webhookresponse = err });
})
  
app.post('/mentorwebhook/', encodeUrl, (requisicao, resposta) => {
	
		console.log("mentor --------------------------------------------");
  console.log(requisicao.body);
  console.log("fim do body mentor --------------------------------------------");
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", "Bearer eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoiYXBpIiwicHJvcGVydGllcyI6eyJrZXlJZCI6ImtleV8wMUhLV0RBNFpOWjJZMktaQTM5OVJWWk1LMSIsIndvcmtzcGFjZUlkIjoid3BjXzAxSEtTWVBOSEtIMDIzNzYwVkJXV1dOUlA3IiwidXNlcklkIjoidXNlcl9hcGkifSwiaWF0IjoxNzA0OTgxNzYzfQ.RYKjA9vaOUWg4RW4qX99wVs0brKs1dVpr0xA-6xJt_YpEC_0ohwWJ-stT0gNT2ahTMkjAl9qkBXF2Nk1c4Jy5wZ9otlcMAnkMlnJvmBw_eksrmKSUjKHpLVGQCMhQd8gT9QG0S0hPXwHzu7iNUWa7Fc0Ziwlkd43yCunScNkYVDBw0LeHsiSaiCmNyhKtutqzoQ_I09lXCaj7cjbLvPTFZUsdZoZcxmqf4ofVBAENo_0uBf3JWdNV27EDzdLsM6pWTRGR_Z5gWdINWhMyF56jq-b3WQz6UNbWJqnU3WAlxHMsRHGW3r8CDdp5OcU3m45InyY29HAWlxpZjOLmZa6oQ");
  
  var raw = JSON.stringify({
    "0": {
      "json": {
        "promptId": "question_answer",
        "data": {
          "question": requisicao.body.pergunta
        },
        "kbs": []
      }
    }
  });
  
  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };
  
  fetch("https://api.conteudo.rdstationmentoria.com.br/trpc/copywriting.create?batch=1", requestOptions)
    .then(response => response.text())
    .then(result => {//console.log(result)
		
		let resultMentor = JSON.parse(result);
		
		let respostaMentor = {
			"resposta": resultMentor[0].result.data.json.content
		}
		
		
		
      resposta.status(200).send(respostaMentor);
    
    } )
    .catch(error => {console.log('error', error) 
                    resposta.status(404).send(error); 
                     });




  
})

    



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
  console.debug("NOvo construtor!!!");
  console.debug(req.params);

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
    console.debug("Aplicação de subiu na porta 3000");
});

//const server = https.createServer({ key, cert }, app);

//const port = 3000;
//server.listen(port, () => {
  //console.debug('Servidor está rodando com https na porta 3000');
//});


app.get('/form/', (req, res) => {
  res.append('Warning', '199 Miscellaneous warning 1111')
    res.sendFile(__dirname + '/views/form.html');
    res.append('Warning', '199 Miscellaneous warning 2222')
    //es.send("<script>alert('teste');</script>");
    

    console.debug('get do form');
   
    

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
               // console.debug("Resultado empodera!!!")
                //console.debug(result)
                let clientesLocalizados = result;
               
                if (clientesLocalizados == null || clienteCNPJRegistroBR.length == 0  ) {
                  
                  //throw new Error('Customer not Found with search ' + nome);
                  console.debug("Vai tentar com outro cnpj: " + nome) 
                  let clienteCNPJSite = BuscaClienteEmpodera(nome);
                  clienteCNPJSite.then(resultado => {
                    console.debug("!!!!!Rodando esta localizacao");
                    clientesLocalizados = resultado;
                  })

                }
                 
                console.debug("Cliente que vai retornar");
                //console.debug(clientesLocalizados);

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
                              
                            }).catch(error => {console.debug('error', error)} );
                      }).catch(error => {console.debug('error', error)} );
                } else {
                   throw new Error("Cliente nao localizado no empodera");             
                }
                    

                

  
}).catch(error => {console.debug('error', error); res.status(404). send();} );
})

app.post('/wservice/', encodeUrl, (req, res) => {
  
  
  url = req.body.busca;
  console.debug(req.body);

  url = url.toLowerCase();

  if (url.indexOf('http') == -1) {
    url = 'https://' + url;
  }

  console.debug("Wservice URL " + url + ' ' + Date());

 
  
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
            console.debug('erro da busca de pagina');
            console.debug(e);
            res.status(404). send("Erro de busca da pagina");
           }) // catch possible errors
         
          })   
   }).catch(e => { 
                    console.debug("Erro de Analize Wappalyzer")
                    console.debug(e)
  
                    })   
 
    
  } catch (error) {
    console.debug("Erro da prospecção inteira")
    console.error(error)
    res.status(404).send("erro de prospecção");
  }

  


  
})


app.post('/prospectaSite/', encodeUrl, (req, res) => {
  
  
  url = req.body.busca;
  console.debug(req.body);

  url = url.toLowerCase();

  if (url.indexOf('http') == -1) {
    url = 'https://' + url;
  }

  console.debug("propsectaSite URL " + url + ' ' + Date());


 
  
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
        
        fetch("http://161.69.63.205:3000/wservice", opcoesDeRequisicao)
        .then(response => response.json())  // converter para json
        .then(json => {res.send(json);})    //imprimir dados no console
        .catch(err => {console.debug('Erro de solicitação no serviço de prospecção', err);
				res.status(404).send(err);
		 });
         
             
    
  } catch (error) {
    console.debug("Erro da prospecção inteira")
    console.error(error)
    res.status(404).send("erro de prospecção");
  }

  


  
})

app.post('/apenasdadosGoverno/', encodeUrl,   (req, res) => {
  var busca = req.body.busca;;
  let num = busca;
console.debug('apenasdadosGoverno ' + num);
let dados = null;
          let urlGover = 'https://publica.cnpj.ws/cnpj/' + num.toString();
          console.debug("urlGover " + urlGover);
          fetch(urlGover)
          // Tratamento do sucesso
          .then(response => response.json())  // converter para json
          .then(json => {res.send(json);})    //imprimir dados no console
          .catch(err => console.debug('Erro de solicitação', err));
})          

app.post('/dadosGoverno/', encodeUrl,   (req, res) => {

  var busca = req.body.busca;;
  let urlHost = new URL(busca);
  let cnpjEncontrado = ''
  let num = '';
  let result = {}
  console.debug("Pagina !!!!!!!!!!!!!!!!!!!!!!!222222 " + url);
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
                console.debug("urlGover sem passar pelo RegistroBR" + urlGover);
                fetch(urlGover)
                // Tratamento do sucesso
                .then(response => response.json())  // converter para json
                .then(json => {res.send(json); })    //imprimir dados no console
                .catch(err => console.debug('Erro de solicitação', err));
                
              }
          
            }

            

          }) // send the result back
          .catch(e => { console.debug(e)})


  pageCNPJ.then((result) => {

      console.debug('cnpjEncontrado ' + cnpjEncontrado)
      if (cnpjEncontrado != '') return;
      let registro = fetchRegistroBr(busca);
      registro.then((result) => {
    
        try{
          cnpjEncontrado = [result.entities[0].publicIds[0].identifier];
          num = cnpjEncontrado[0].replace(/\D/g,'').substring(0,14);
        } catch (erro) {
          console.debug("Não foi possível pegar o CNPJ do domímio");
          console.debug(result)
        }  
        if (num.length >= 14)  {
      
          let dados = null;
          let urlGover = 'https://publica.cnpj.ws/cnpj/' + num.toString();
          console.debug("urlGover " + urlGover);
          fetch(urlGover)
          // Tratamento do sucesso
          .then(response => response.json())  // converter para json
          .then(json => {res.send(json);})    //imprimir dados no console
          .catch(err => console.debug('Erro de solicitação', err));
          
        }
      }).catch(erroRegistro => {console.debug("erro na requisicao que recupera o Registro"); console.debug(erroRegistro)});
    }).catch(erroCNPJ => {console.debug("erro na requisicao que recupera o cnpj"); console.debug(erroCNPJ)})    
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

  //console.debug("BuscaClienteEmpodera " + nome)

  let urlEmpodera = [];
  urlEmpodera.push("https://empodera.totvs.com/api/area/totvs/customers-data/search?customer=");
  urlEmpodera.push(nome);
  urlEmpodera.push("&status=Ativo&healthscoreType=totvs&mrr=&tickets=&report=false&take=15&skip=0&currentPage=1&perPage=10&sortAc=true&oportunity=all");
  
  let requestOptions = getEmpoderaResquetHeader();
  //console.debug(urlEmpodera.join(""));
  return new Promise((resolve, reject) => {
    fetch(urlEmpodera.join(""), requestOptions).then((response) => {
     
      if (!response.ok) return resolve(response)
      return response.json();
    }).then((jsonData) => {
      console.debug("BuscaClienteEmpodera deu bom!")
      let result = jsonData
     
      resolve(result)
    }).catch((err) => {
      console.debug("Erro ao tentar buscar dados do Empodera")  
      console.debug(err)
      reject(err)
      //throw err
  
    });
  })


}  



async function fetchRegistroBr(inputAddress) {

  let urlHost = new URL(inputAddress);

  let result = {}

  return new Promise((resolve, reject) => {
    console.debug(registroBR_URL + '/' + urlHost.host);
    fetch(registroBR_URL + '/' +  urlHost.host)
      .then((response) => {
        console.debug(response)
        if (!response.ok) return resolve(result)
        return response.json();
      }).then((jsonData) => {
        console.debug(jsonData)
        result = jsonData
        console.debug(result);		
        let cnpj = [result.entities[0].publicIds[0].identifier];
        let num = cnpj[0].replace(/\D/g,'').substring(0,14);
		    resolve(result)
      }).catch((err) => {
		    console.debug("erro da parada")  
        console.debug(err)
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
        console.debug(err);
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
        console.debug("resposta similar Web");
        console.debug(response);
        console.debug("response.ok");
        console.debug(response.ok)


        if (!response.ok) return resolve(result)
        return response.json();
      }).then((jsonData) => {
        result = jsonData
        console.debug("Moretti greatest hit ?")
        console.debug(result)
        res.status(200).send(jsonData);
        resolve(result)
      }).catch((err) => {
        console.debug("Erro ao buscar trafego");
        res.status(404).send(err);
        console.debug(err);
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
		
		
		console.debug("vals valores");
		console.debug(vals);
		
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
        console.debug(err);
      });
  })
}

function extractsCNPJ(resultsArray){
    console.debug("Chegou aqui");
    //console.dir(resultsArray);
    //console.debug(resultsArray[0]);
    let cnpjValue = resultsArray[0].replace(/\D/g,'').substring(0,14);
    let numeroCNPJ = resultsArray[0].replace(/\D/g,'').substring(0,14);
    cnpjValue = cnpjValue.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
    
    console.debug("Numero cnpj " + numeroCNPJ);
    //document.getElementById("cnpj").value=cnpjValue;
    
    let dados = null;
    let urlGover = 'https://publica.cnpj.ws/cnpj/' + numeroCNPJ.toString();
    fetch(urlGover)
    // Tratamento do sucesso
    .then(response => response.json())  // converter para json
    .then(json => {populadadosGoverno(json);})    //imprimir dados no console
    .catch(err => console.debug('Erro de solicitação', err));
    
    
}

function populadadosGoverno(json) {
    console.debug("Dados governo");   
    console.debug(json);
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

function retornaApresentador(json) {

  let mail = json.payload.scheduled_event.event_memberships[0].user_email
  
  let usersRD = [
    {
      "id": "6361707267edf7001b72b4c7",
      "name": "Fernando Gordilho",
      "email": "fernando.gordilho@totvs.com.br"

    },

    {
      "id": "63514b20a7e955000c0ece48",
      "name": "Ruan Fagundes",
      "email": "ruan.fagundes@totvs.com.br"

    },
    {
      "id": "637671145c04e200168f1de9",
      "name": "João Moretti",
      "email": "joao.moretti@fluig.com"
    },
    {
      "id": "62db0782987f1a000c1c86c3",
      "name": "Jhon",
      "email": "jhonatans.aguiar@totvs.com.br"
    }
  ];


  return usersRD.find((u) => u.email == mail);

}

app.get('/ping', (req, res) => {
  console.log("ping " + req.ip);
  res.status(201).send("pong")
})

app.get('/colaboradores/:nomeEmpresa', (req, res) => {
  var BING_SEARCH_URL = "https://www.bing.com/search?q=";
    //res.writeHead(200, {"Content-Type": "application/html"});
    console.log("req.params.nomeEmpresa " + req.params.nomeEmpresa)

    var empresaString = req.params.nomeEmpresa.replaceAll(" ", "+");


    console.log("empresaString " + empresaString);

    let urlColabs = [];
    urlColabs.push(BING_SEARCH_URL);
    urlColabs.push("quantos+funcionários+tem+")
    urlColabs.push(empresaString);
   urlColabs.push("&qs=n&form=QBRE&sp=-1&pq=&sc=0-0&sk=&cvid=FD7B4C6DAF0B48EFBE5AD381D983EE01&ghsh=0&ghacc=0&ghpl=");
   
    console.log(urlColabs.join(""));
    fetch(urlColabs.join("")).then(resposta => { console.log(resposta); return resposta.text()})
    .then(html => {
      
      var StringInicial = '<div class="b_focusTextMedium">'
      var StringInicialLarge = '<div class="b_focusTextLarge">'
      var StringFinal = '</div>'

      var posicaoInicial = html.indexOf(StringInicial) + StringInicial.length;

      var count = (html.match(/<div class="b_focusTextMedium">/g) || []).length;
      var countlsrge = (html.match(/<div class="b_focusTextLarge">/g) || []).length;
      console.log("countMedium " + count + " countlsrge " + countlsrge);
      if (count == 0) {
        var posicaoInicial = html.indexOf(StringInicialLarge) + StringInicialLarge.length;
      }




      var corte = html.substring(posicaoInicial, html.length);





      var  posicaoFinal = posicaoInicial + corte.indexOf(StringFinal);

      console.log("posicaoInicial " + posicaoInicial);
      console.log("posicaoFinal " + posicaoFinal);

      var colaboradores = html.substring(posicaoInicial, posicaoFinal);

      if (colaboradores.indexOf("&#225;") > -1) {
        colaboradores = colaboradores.replace("&#225;", "á")
      }

      //console.log(colaboradores)

      
      res.send(colaboradores);
      //res.send(html);


    }).catch(erro => {console.log(erro)})
    
  })   




