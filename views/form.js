let codigoCliente = 0;
        let ultimocCliente = 0;
        let primeiroCliente = 0;
        let codigoAnterior = 0;
        let codigoPosterior = 0;
        let clienteAtual = null;
        let novoCliente = false;
        let token = '';


        function setaCampo(nome, valor) {
            document.getElementById(nome).value=valor;
        }

        function primeiro() {
            buscaPrimeiroCliente();
            codigoCliente = primeiroCliente;
            carregaCliente();
        }

        function ultimo() {
            buscaUltimoCodigoCliente();
            codigoCliente = ultimocCliente;
            carregaCliente();
        }

 
        

        function buscaUltimoCodigoCliente() {
            fetch('/api/v1/clientes/ultimo', {
                method: 'get',
                headers: {"Token": token}              
               
            }).then((res) => res.json())
                .then((data) => {
                    ultimocCliente = data;
                })
                .catch((err) => console.log(err));
        }
        //buscaUltimoCodigoCliente();

        function buscaPrimeiroCliente() {
            
            fetch('/dadosGoverno/', {
                method: 'get',
                headers: {"Token": token}               
               
            }).then((res) => res.json())
                .then((data) => {
                    primeiroCliente = data;
                })
                .catch((err) => console.log(err));
        }
        //buscaPrimeiroCliente();
        

        function proximo() {
            if (codigoPosterior != null) {
                codigoCliente = codigoPosterior;
                carregaCliente();
            }
            
        }

        function anterior() {

            if (codigoAnterior != null) {
                codigoCliente = codigoAnterior;
                carregaCliente();
            }

        }

        function buscaCliente() {
            return new Promise((resolve, reject) => {
                fetch('http://localhost:5001/dadosGoverno/',
                {   method : 'get',
                    headers: {"Token": token}})
                    .then(res => res.json())
                    .then(data => {
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

        
