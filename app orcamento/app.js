class Despesa {
	constructor(ano,mes,dia,tipo,descricao,valor){
		this.ano = ano
		this.mes = mes
		this.dia = dia
		this.tipo = tipo
		this.descricao = descricao
		this.valor = valor
	}

	validarDados(){
		for (var x in this){
				if(this[x] == undefined || this[x] == "" || this[x] == null){
					return false
				}		
		}
		return true
	}
}

class Bd{

	constructor(){
		let id = localStorage.getItem('id')

		if(id == null){
			localStorage.setItem('id',0)
		}

		this.id = 0
	}
	getProximoId(){
		let proximoId = localStorage.getItem('id')
		return (parseInt(proximoId)+1)
	}

	gravar(d){
	
	let id = this.getProximoId()

	localStorage.setItem(id, JSON.stringify(d))

	localStorage.setItem('id',id)
	}

	recuperarTodosRegistros(){
		let despesas = []

		let id = localStorage.getItem('id')
		
		//recuperar todas as despesas cadastradas em localStorage
			for(let i = 1 ; i<= id; i++)
			{
				let despesa = JSON.parse(localStorage.getItem(i))

				if(despesa === null)
				{
					continue
				}

				despesa.id = i
				despesas.push(despesa)

			}

		return despesas
		}
	
	pesquisar(d){
		let despesas = this.recuperarTodosRegistros()

		for (var y in d)
		{
			if(d[y] == "")
			{
				continue
			}
			
			despesas = despesas.filter( x => x[y] == d[y])
		}
		
		return despesas

	}

	remove(id){
		
		console.log(id)

		localStorage.removeItem(id)

		render(this.recuperarTodosRegistros())
	}
}

let bd = new Bd()

$(document).ready(()=>{$('#start').click(()=>{	
	let ano = $('#ano').val()
	let mes = $('#mes').val()
	let dia = $('#dia').val()
	let tipo = $('#tipo').val()
	let descricao = $('#descricao').val()
	let valor = $('#valor').val()
	
	let despesa = new Despesa(ano,mes,dia,tipo,descricao,valor)
	
	if(despesa.validarDados())
	{
		bd.gravar(despesa)

		$('#mymodalLabel').html('Registro inserido com sucesso')
		document.querySelector('#mymodalLabel').className = ('modal-title text-success')
		$('#bodaymodal').html('Despesa foi cadastrada com sucesso!')
		document.querySelector('#closemodal').className = ('btn btn-success')
		$('#mymodal').modal('show')



	}else{
		$('#mymodalLabel').html('Erro na gravação')

		$('#mymodalLabel').className = ('modal-title text-danger')

		$('#bodaymodal').html('Por favor digite todos os campos.')

		document.querySelector('#closemodal').className = ('btn btn-danger')

		$('#mymodal').modal('show')
	}
	

})})

function carregaListaDespesas(){
	let despesas

	despesas = bd.recuperarTodosRegistros()
	
	render(despesas)
}

function pesquisarDespesa(){
	let ano = $('#ano').val()
	let mes = $('#mes').val()
	let dia = $('#dia').val()
	let tipo = $('#tipo').val()
	let descricao = $('#descricao').val()
	let valor = $('#valor').val()
	
	let despesa = new Despesa(ano,mes,dia,tipo,descricao,valor)
	
	despesa = bd.pesquisar(despesa)

	render(despesa)

}

function render(d){

	var despesa = d;

	var listaDespesas = document.querySelector('#listaDespesas')
	
	document.querySelector('#listaDespesas').innerHTML = ""

	despesa.forEach( (d)=>{
		//criando o tr
		var linha = listaDespesas.insertRow()

		linha.insertCell(0).innerHTML =  `${d.dia}/${d.mes}/${d.ano}`

		switch(d.tipo){
			case "1": d.tipo = 'Alimentação'; break;
			case "2": d.tipo = 'Educação'; break;
			case "3": d.tipo = 'Lazer'; break;
			case "4": d.tipo = 'Saúde'; break;
			case "5": d.tipo = 'Transporte'; break;

		}

		linha.insertCell(1).innerHTML =  d.tipo
		linha.insertCell(2).innerHTML =  d.descricao
		linha.insertCell(3).innerHTML =  d.valor

		let btn = document.createElement('button')

		btn.className = 'btn btn-danger'
		
		btn.innerHTML = '<i class="fas fa-trash-alt"></i>'

			btn.id = d.id

		btn.onclick = function(){bd.remove(this.id)}

		linha.insertCell(4).append(btn)


		event.stopPropagation()

		})
}