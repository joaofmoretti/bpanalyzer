const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('D:/Totvs/sqlite/bd_dados_qsa_cnpj.db');


let empresa = {
   
    "razao_social": "",
    "estabelecimento": {
        "cnpj": "",
        "atividade_principal": {
            
            "descricao": ""
        },
       
        "estado": {
           
            "nome": ""
           
        },
        "cidade": {
           
            "nome": ""
            
        }
    },
    "socios": []

};

db.serialize(() => {
    
 
    db.each("SELECT * FROM cnpj_dados_cadastrais_pj WHERE cnpj = '45987005000198'", (err, row) => {
        empresa.razao_social = row.razao_social;
        empresa.estabelecimento.cnpj = row.cnpj;
        empresa.estabelecimento.cidade = row.municipio;
        empresa.estabelecimento.estado = row.uf;

        console.log(row.cnae_fiscal);

        db.each("SELECT * FROM tab_cnae WHERE cod_cnae = '" + row.cnae_fiscal + "'", (erro, cnae) => {
            console.log(cnae);
            empresa.estabelecimento.atividade_principal.descricao = cnae.nm_cnae;
        });

        console.log(empresa);

    });
});

db.close();