/* config */
/*
- Atividade = bpmn:Task	, 'bpmn:ServiceTask' ,  'bpmn:ScriptTask'
	Atributos xml :
		_wiseit_codigo
		
- Condicao = bpmn:ExclusiveGateway
	Atributos xml :
		_wiseit_codigo

- Fluxo = bpmn:SequenceFlow
	Atributos xml :
		_wiseit_codigo

- Processo = bpmn:SubProcess
	Atributos xml :
		_wiseit_codigo

- Fluxo entre pools - bpmn:Association		
- Inicio = bpmn:StartEvent
- Fim = bpmn:EndEvent

- Acoes = IntermediateCatchEvent 
			Email - MessageEventDefinition 

- Linha ponteada = DataOutputAssociation

*/
	
	
	
	
	// globais
	var intervalo = 100; // milisegundos
	var maxTempoTimeout = 1000; // milisegundos
	var limite = maxTempoTimeout / intervalo;
	//var flgIsReplace = false;
	var flagSalvar = true;

	/* MODULOS */
		
	// Menu contextual
	function CustomContextPadProvider(contextPad) {
	
		this.getContextPadEntries = function(element) {
			var nuevoBoton = new Object();
			nuevoBoton.action = function(){ 
				//alert( element.type );
				abrePropiedades( element );	
			};
			nuevoBoton.className = "icon-wiseit-zoom";
			nuevoBoton.group = "model";
			nuevoBoton.title = "Propriedades";	  


			//alert( getAttribute( el.id , '_wiseit_codigo' ) );

			if( getAttribute( element.id , '_wiseit_codigo' ) ){
					return {'nuevoBoton':nuevoBoton};
			}else{
					return;	
			}
				
			
		};
		
		contextPad.registerProvider(this);
	
	}
	
	CustomContextPadProvider.$inject = [ 'contextPad' ];
	
	var contextPadModule = {
		// extension module
		__init__: [ 'customContextPadModule' ],
		customContextPadModule: [ 'type', CustomContextPadProvider ]
	};

	// Menu herramientas
	function CustomPaletteProvider(palette, create, elementFactory, spaceTool, lassoTool) {
	
		this.getPaletteEntries = function() {
			var nuevoBoton = new Object();
			nuevoBoton.action = function(){ 
	 
	 
				/* exemplo :
					2 Task conectadas 
				*/	 
				/*
				var task1 = createShape( { type : 'bpmn:Task' } , {x: 400 , y:400} , getElemById('Process_1') );
				var task2 = createShape( { type : 'bpmn:Task' } , {x: 800 , y:400} , getElemById('Process_1') );
				createConnection(task1, task2, {type:'bpmn:SequenceFlow'} , getElemById('Process_1') );
				*/ 

				

				
				/*
				alert( getSelected().type );
				getSelected().type = 'bpmn:ScriptTask';
				alert( getSelected().type );
				*/
				//setAttribute( getSelectedId() , 'type' , 'bpmn:ScriptTask' );
				
				//getSelected().businessObject.$type = 'bpmn:ScriptTask'; 
				/*
				showTipoAtividadeIcone( 'worker' );
				showAlertaIcone( getSelected() , 'acaoEnvioEmail' , 0);
				showAlertaIcone( getSelected() , 'acaoEnvioEmail' , 1);
				showAlertaIcone( getSelected() , 'alerta' , 0 );
				showAlertaIcone( getSelected() , 'alerta' , 1 );
				showAlertaIcone( getSelected() , 'alerta' , 2 );						 				
		
*/



				
				bpmnjs.saveXML(	function(err, xml) { 
					console.log(xml);	
					alert( xml );
				}) 
					
			};
			nuevoBoton.className = "icon-wiseit-download";
			nuevoBoton.group = "model";
			nuevoBoton.title = "Baixar XML";	  

	
			//return {'exportar':nuevoBoton  };
			return {};
			
		};

		palette.registerProvider(this);
	
	}
	
	CustomPaletteProvider.$inject =  [ 'palette', 'create', 'elementFactory', 'spaceTool', 'lassoTool' ];
	
	var paletteModule = {
		// extension module
		__init__: [ 'customPaletteModule' ],
		customPaletteModule: [ 'type', CustomPaletteProvider ]
	};

	// Eventos
	function InteractionEvents(eventBus) {
		
		eventBus.on('shape.remove', function(event) {	
		});
		eventBus.on('shape.removed', function(event) { // remover elemento
			
			if( ! flagSalvar )
				return;
			
			var e = event.element.businessObject;
			var el = getElemById( e.id );
			
			switch( el.type ){
				case 'bpmn:Task': // Atividade
				case 'bpmn:ServiceTask': // Atividade Automatica
				case 'bpmn:ScriptTask': // Worker
					/* ao fazer o replace é chamado o evento shape.removed && shape.added */
					/* Para nao excluir uma atividade que mudou de tipo Task para ServiceTask|ScriptTask utiliza esta flg 
						true é um replace */
					//if( ! flgIsReplace ){
						removeAtividade( getAttribute( el.id , '_wiseit_codigo' )  , el.id );
						limpaLixo();	
					//}
					break;	
				case 'bpmn:ExclusiveGateway': // Condicao
					/**/
					break;	
				case 'bpmn:SequenceFlow': // Fluxo

					if( el.source.type == "bpmn:StartEvent" &&  ( isTask( el.target.type ) || el.target.type == "bpmn:SubProcess" )){	// origem é Start
					
						var codDestino = getAttribute( el.id , '_wiseit_codigo' );
						removeFluxoDestino( codDestino , el.id );			
					
					}else if( 
						( isTask( el.target.type ) || el.target.type == "bpmn:SubProcess" ) && 
						( isTask( el.source.type ) || el.source.type == "bpmn:SubProcess" ) ){ // destino condicao
					
							var codOrigem = getAttribute( el.source.id , '_wiseit_codigo' );	
							removeFluxoOrigem( codOrigem , el.id );	
					
					}else if( el.target.type == "bpmn:ExclusiveGateway" ){ // destino é uma condicao
					
						var codCondicao = el.target.id;
						setTimeout( function(){ removeElementById( codCondicao ); } , 10 );
					
					}else if( el.source.type == "bpmn:ExclusiveGateway" ){ // origem é uma condicao
					
						var cod = getAttribute( el.id , '_wiseit_codigo' );
						var isStart = getAttribute( el.id , '_wiseit_isStart' );
						if( isStart ){
							if( cod )
								removeFluxoDestino( cod , el.id );										
						}else{
							if( cod )
								removeFluxoOrigem( cod , el.id );									
						}
					
					}	

					break;	
				case 'bpmn:SubProcess': // Processo
					removeProcessoExterno( getAttribute( el.id , '_wiseit_codigo' )  , el.id );
					break;	
				case 'bpmn:StartEvent': // Inicio
					//code block
					break;	
				case 'bpmn:EndEvent': // Fim
					//code block
					break;																						
			}	

		});		
		eventBus.on('shape.add', function(event) {	
		});	
		eventBus.on('shape.added', function(event) {// adicionar elemento
			
			if( ! flagSalvar )
				return;			
			
			var e = event.element.businessObject;
			var el = getElemById( e.id );
				
			switch( el.type ){
				case 'bpmn:Task': // Atividade
				case 'bpmn:ServiceTask': // Atividade Automatica
				case 'bpmn:ScriptTask': // Worker
					
					//if( ! flgIsReplace ){
						var wiseit_codigo = getAttribute( el.id , '_wiseit_codigo');
						if( wiseit_codigo == null ){
							var nome = getLabelAtividade();
							setAttribute( el.id , 'name' , nome );
							var obj = {nome:nome,tipoProcesso:{codigo:codTipoProcesso}};
							createAtividade( obj, el.id );			
							cancelLabelEdit();
						}
					
					//}
					
					break;	
				case 'bpmn:ExclusiveGateway': // Condicao
					//code block
					break;	
				case 'bpmn:SequenceFlow': // Fluxo
					
					if( el.source.type == "bpmn:StartEvent" &&  ( isTask( el.target.type ) || el.target.type == "bpmn:SubProcess" ) ){	// origem Start	
						/*
							Este timer fica em loop cada 1/10seg ate codDestino ter valor ( Atividade foi criada )
							O problema de não ter codDestino acontece quando o Fluxo e a Atividade é criado ao mesmo tempo
						*/		
						var cont;				
						var timer = setInterval( function(){  						
							var codDestino = getAttribute( el.target.id , '_wiseit_codigo' );
							var wiseit_codigo = getAttribute( el.id , '_wiseit_codigo');
							
							if( wiseit_codigo == null && codDestino ){	
								var obj = {'tipoAtividade':{'codigo':codDestino}};	
								createFluxoDestino( obj , el.id );	
								clearInterval( timer );	
							}
							
							cont++;
							if( cont == limite )
								clearInterval( timer );								
							
						} , intervalo )	
											
					}else if( 
						( isTask( el.target.type ) || el.target.type == "bpmn:SubProcess" ) && 
						( isTask( el.source.type ) || el.source.type == "bpmn:SubProcess" ) ){ // destino condicao
						/*
							Este timer fica em loop cada 1/10seg ate codDestino ter valor ( Atividade foi criada )
							O problema de não ter codDestino acontece quando o Fluxo e a Atividade é criado ao mesmo tempo
						*/
						var cont;
						var timer = setInterval( function(){  
							var codOrigem = getAttribute( el.source.id , '_wiseit_codigo' );
							var codDestino = getAttribute( el.target.id , '_wiseit_codigo' );
							var wiseit_codigo = getAttribute( el.id , '_wiseit_codigo');
							
							if( wiseit_codigo == null && codDestino && codOrigem ){				
								var obj = {'destino':{'tipoAtividade':{'codigo':codDestino}},'tipoAtividade':{'codigo':codOrigem}};	
								createFluxoOrigem( obj , el.id );
								clearInterval( timer );	
							}
							
							cont++;
							if( cont == limite )
								clearInterval( timer );	
						
						} , intervalo )
							
					}else if( el.target.type == "bpmn:ExclusiveGateway" ){ // origem de uma condicao
						
						if( el.target.incoming.length > 1 ){ // existe mais de um origem para condicao
								removeElementById( el.id );
								msgwiseit("exclamacao", 'Fluxo invalido.', 'Ok,fecharmsg()');
								break;
						}/* foi feita a validacao para exibir icone block*/

						if( el.target.incoming && 
							el.target.incoming.length == 1 && 
							el.target.outgoing && 
							el.target.outgoing.length > 0 ){ // existe um fluxo de entrada e ao menos um de saida
							
							
							var cont;
							var timer = setInterval( function(){  					
								var codOrigem = getAttribute( el.source.id , '_wiseit_codigo' );
								var codDestino = getAttribute( el.target.outgoing[0].target.id  , '_wiseit_codigo' );
								var wiseit_codigo = getAttribute( el.id , '_wiseit_codigo');

								if( wiseit_codigo == null && codDestino && codOrigem ){				
									var obj = {"destino":{"tipoAtividade":{"codigo":codDestino}},"tipoAtividade":{"codigo":codOrigem}};							
									createFluxoOrigem( obj, el.id );
									clearInterval( timer );	
								}
								
								cont++;
								if( cont == limite )
									clearInterval( timer );	
							
							} , intervalo )
						}
								
					}else if( el.source.type == "bpmn:ExclusiveGateway" ){ // destino de uma condicao
						
						if( ! existeFluxoEntrada( el.source.id ) ){ // existe fluxo de origem para condicao
								var idCondicao = el.source.id;
								setTimeout( function(){ setSelected( getElemById( idCondicao ) ) } , intervalo ); // seleciono a condição com erro
								removeElementById( el.id );
								msgwiseit("exclamacao", 'Condição sem fluxo de entrada.', 'Ok,fecharmsg()');
								break;
						}/* foi feita a validacao para exibir icone block*/

						if( el.source.incoming && 
							el.source.incoming.length == 1 && 
							el.source.outgoing && 
							el.source.outgoing.length > 0 ){ // existe um fluxo de entrada e ao menos um de saida
							
							var cont;
							var timer = setInterval( function(){  
								
								if( el && el.source ){
								
									if( el.source.type == "bpmn:EndEvent" ){
											/* um fluxo de uma condição que vai para final */
									}else if( el.source.incoming[0].source.type == "bpmn:StartEvent" ){
									
											var codDestino = getAttribute( el.target.id , '_wiseit_codigo' );
											var wiseit_codigo = getAttribute( el.id , '_wiseit_codigo');
											
											if( wiseit_codigo == null && codDestino ){				
												var obj = {"tipoAtividade":{"codigo":codDestino}};
												setAttribute( el.id , '_wiseit_isStart' , true );
												createFluxoDestino( obj, el.id );
												clearInterval( timer );	
											}
										
									}else{
									
											var codOrigem = getAttribute( el.source.incoming[0].source.id , '_wiseit_codigo' );
											var codDestino = getAttribute( el.target.id , '_wiseit_codigo' );
											var wiseit_codigo = getAttribute( el.id , '_wiseit_codigo');
											
											if( wiseit_codigo == null && codDestino && codOrigem ){				
												var obj = {"destino":{"tipoAtividade":{"codigo":codDestino}},"tipoAtividade":{"codigo":codOrigem}};
												createFluxoOrigem( obj, el.id );
												clearInterval( timer );	
											}
																			
									}
								
								}
									
								cont++;
								if( cont == limite )
									clearInterval( timer );									
							
							} , intervalo )								
							
						}
								
					}								
					
					break;	
				case 'bpmn:SubProcess': // Processo
					var wiseit_codigo = getAttribute( el.id , '_wiseit_codigo');
					if( wiseit_codigo == null ){
						var nome = getLabelProcesso();
						setAttribute( el.id , 'name' , nome );
						var obj = {nome:nome,tipoProcesso:{codigo:codTipoProcesso}};
						createAtividade( obj, el.id );
						cancelLabelEdit();
					}
					
					break;	
				case 'bpmn:MessageFlow': // Processo
					
	 				//replaceElement( el , createElement('bpmn:Task') );
			
					break;						
				case 'bpmn:StartEvent': // Inicio
					//code block
					break;	
				case 'bpmn:EndEvent': // Fim
					//code block
					break;																						
			}				
			
			applyStyles();

		});					
		
		eventBus.on('selection.changed', function(el) {	 
		});
		eventBus.on('element.dblclick', function(event) {	
			
			if( 	event.element.type == 'bpmn:ExclusiveGateway' || 
					event.element.type == 'bpmn:StartEvent' || 
					event.element.type == 'bpmn:EndEvent' || 
					event.element.type == 'bpmn:IntermediateCatchEvent' || 
					event.element.type == 'bpmn:IntermediateThrowEvent' ){
				
						clearUndoHistory();
			
			}			
			
			if( 	event.element.type == 'bpmn:SubProcess' || 
					isTask( event.element.type ) || 
					event.element.type == 'bpmn:SequenceFlow' ||
					( event.element.type == 'label' && event.element.labelTarget.type== 'bpmn:SequenceFlow') // label do fluxo
				){
					
					var elem = event.element;
					clearUndoHistory();
					
					if(elem.type == 'label' && elem.labelTarget.type== 'bpmn:SequenceFlow') // se é um label dum fluxo , faz foco nele para abrir as propriedades
						elem = elem.labelTarget;
					
					abrePropiedades( elem );			
					setSelected( elem );
			}
						
		});		
		eventBus.on('element.updateLabel', function(event) {	
		});			
		eventBus.on('element.changed', function(event) {	
		});		
		eventBus.on('element.click', function(event) {							
		});	
		eventBus.on('element.hover', function(event) {	
		
			if( 	event.element.type == 'bpmn:IntermediateCatchEvent' || 
					event.element.type == 'bpmn:IntermediateThrowEvent' ){
				
						$('#status').html( getAttribute( event.element.id , '_wiseit_status') );
						$('#status').show();
			
			}else{
				$('#status').hide();
				window.focus();	
			}		
		
			
			
		});		
		
							
	}
	
	InteractionEvents.$inject = [ 'eventBus' ]; // minification save
	
	// Modulo Eventos
	var eventsModule = {
		__init__: [ 'InteractionEvents' ],
		InteractionEvents: [ 'type', InteractionEvents ]
	};
	
	/* FIM MODULOS */
	
	
	
	
	/* Aplica os estilos no diagrama*/
	function applyStyles(){

		bpmnjs.get('canvas')._elementRegistry.forEach( 
			function(e){
				//console.log(e.id)
				if( isTask( e.type ) )
					bpmnjs.get('canvas').addMarker(e.id, 'wiseit_task');
	
				if( e.type == 'bpmn:SubProcess')
					bpmnjs.get('canvas').addMarker(e.id, 'wiseit_subProcess');
	
				if( e.type == 'bpmn:ExclusiveGateway')
					bpmnjs.get('canvas').addMarker(e.id, 'wiseit_exclusiveGateway');
					
				if( e.type == 'bpmn:StartEvent')
					bpmnjs.get('canvas').addMarker(e.id, 'wiseit_startEvent');				
					
				if( e.type == 'bpmn:EndEvent')
					bpmnjs.get('canvas').addMarker(e.id, 'wiseit_endEvent');

				if( e.type == 'bpmn:IntermediateCatchEvent')
					bpmnjs.get('canvas').addMarker(e.id, 'wiseit_intermediateCatchEvent');	

				if( e.type == 'bpmn:IntermediateThrowEvent')
					bpmnjs.get('canvas').addMarker(e.id, 'wiseit_intermediateThrowEvent');						
									
					
			} 
		)	
	}
	
	/*  Salva _wiseit_codigo nos estilos de cada objeto: 
		class="wiseit_codigo_" + codigo
		class="wiseit_codigo_888"  	
	*/
	function classWiseitCodigo(){

		bpmnjs.get('canvas')._elementRegistry.forEach( 
			function(e){
				//console.log(e.id)
				var codigo = getAttribute( e.id , '_wiseit_codigo' );
				if( codigo ){
					bpmnjs.get('canvas').addMarker(e.id, "wiseit_codigo_" + codigo);		
				}
									
			} 
		)	
	}	
	
	
	/* Abre tela de propiedades da cada elemento , pasando como parametro o element */
	function abrePropiedades( e ){
			
		var codigo = getAttribute( e.id , '_wiseit_codigo' );
		var element = getElemById( e.id );
		
		switch( element.type ){
			case 'bpmn:Task': // Atividade
			case 'bpmn:ServiceTask': // Atividade Automatica
			case 'bpmn:ScriptTask': // Worker
				abreTelaAtividade( codigo );
				break;	
			case 'bpmn:SubProcess': // Processo
				abreTelaAtividadeProcessoExterno( codigo );
				break;		
			case 'bpmn:SequenceFlow': // Fluxo
				
				if( codigo && ! getCondicaoByFluxo( element.id ) ){ // se tem codigo e não é um fluxo de uma condição
					var inicio = isFluxoInicio( element.id  );
					abreTelaFluxo( codTipoProcesso, inicio, codigo );
				}else{ // é um fluxo de uma condição
					if( isFluxoSaida( element.id ) ){
						var codFluxoEntrada = getCondicaoByFluxo( element.id ).incoming[0].id;								
						var inicio = isFluxoInicio( codFluxoEntrada );
						var codCondicao = getCodigoCondicao( getCondicaoByFluxo( element.id ).id ); // codigo de todos os fluxos de saida separadso por | , exemplo 555|556|557
						abreTelaCondicao( codTipoProcesso, codCondicao , inicio, codigo );
					}else{
						msgwiseit("exclamacao", 'As propiedades desse fluxo não podem ser editadas.', 'Ok,fecharmsg()');	
					}
				}	
				
				break;	
			case 'bpmn:ExclusiveGateway': // Condicao
					var codCondicao = getCodigoCondicao( element.id ); // codigo de todos os fluxos de saida separadso por | , exemplo 555|556|557
					abreTelaCondicao( codTipoProcesso, codCondicao , false, '' );					
				break;															
		}
	
	}	
	
	/* Seta valor de um atributo : 
		params: 
			id do objeto , nome de atributo , valor do atributo 
	*/
	function setAttribute( elementId , nameAtt , valueAtt ){
		bpmnjs.invoke(function(elementRegistry, modeling) {
			var el = Object();
			eval( "el."+nameAtt+" = '"+valueAtt+"'"); 
			var SubProcessShape = elementRegistry.get( elementId );			
			modeling.updateProperties(SubProcessShape, el );
		})				
	}
	
	/* Pega valor do atributo 
		params: 
			id do objeto , nome de atributo 
	*/
	function getAttribute( elementId , nameAtt ){
		var retorno;
		bpmnjs.invoke(function(elementRegistry) {
			var SubProcessShape = elementRegistry.get( elementId );			
			retorno = eval('SubProcessShape.businessObject.' + nameAtt );
		})	
		return retorno;			
					
	}	

	/* Seleciona um objeto na tela */
	function setSelected( obj ){
		bpmnjs.invoke(function(selection) {
			selection.select(null); // limpo seleção
			selection.select( obj , true );
		})
	}	
	
	/* Retorna todos os objectos selecionados */
	function getSelecteds(){
		var sel;
		bpmnjs.invoke(function(selection) {
			sel = selection.get();
		})
		return sel; 
	}		
	
	/* Retorna o primero objeto selecionado */
	function getSelected(){
		return  getSelecteds()[0]; 
	}	
	
	/* Retorna o id do objeto selecionado */
	function getSelectedId(){
		return getSelected().id;
	}	
	
	/* Retorna um objeto pasando como parametro : id do objeto */
	function getElemById( elementId ){
		var retorno;
		bpmnjs.invoke(function(elementRegistry) {
			retorno = elementRegistry.get( elementId );			
		})	
		return retorno;						
	}	
	
	/* Retorna um objeto pasando como parametro : _wiseit_codigo do objeto */
	function getElemByWiseitCodigo( wiseit_codigo ){
		var retorno = false;
		bpmnjs.get('canvas')._elementRegistry.forEach( 
			function(e){
				if( getAttribute( e.id , '_wiseit_codigo' ) == wiseit_codigo )
					retorno = e;
			} 
		)
		return retorno;						
	}		
	
	/* Retorna objeto Condicao 
		params: 
			id do element de fluxo de entrada ou de saida 
	*/
	function getCondicaoByFluxo( elementId ){
		var elem = getElemById( elementId );
		if( elem.source.type == 'bpmn:ExclusiveGateway' )
			return elem.source;
		if( elem.target.type == 'bpmn:ExclusiveGateway' )
			return elem.target;	

		return false;			
	}
	
	/* Retorna true se é um fluxo de saida duma Condicao */
	function isFluxoSaida( elementId ){
		var elem = getElemById( elementId );
		if( elem.source.type == 'bpmn:ExclusiveGateway' )
			return true;

		return false;			
	}	
	
	/* Retorna true se é um fluxo de inicio do processo */
	function isFluxoInicio( elementId ){
		var elem = getElemById( elementId );
		if( elem.source.type == 'bpmn:StartEvent' )
			return true;

		return false;			
	}		
	
	/* Retorna true se existe fluxo de entrada numa Condicao
		params : 
			condicaoId 
	*/
	function existeFluxoEntrada( elementId ){
		var elem = getElemById( elementId );
		if( elem.incoming.length > 0 )
			return true;

		return false;			
	}		
	
	
	/* Retorna o codigo de uma Condicao */
	function getCodigoCondicao( elementId ){
		var elem = getElemById( elementId );	
		var codigos = '';
		for( var i = 0 ; i < elem.outgoing.length ;  i++ ){
			var cod = getAttribute( elem.outgoing[i].id , '_wiseit_codigo' );
			if( cod && cod != '' ){
				if( i > 0 ) 
					codigos += '|';	
				codigos += cod;	
			}
		}
		return codigos;
	}		
	
	/* Romove um objeto
		params : 
			id do objeto 
	*/
	function removeElementById( elementId ){
		bpmnjs.invoke(function( modeling ) {
				setSelected( getElemById( elementId ) );
				removeElementSelected();
		}) 				
	}	
	
	/* Romove objetos selecionados
	*/
	function removeElementSelected(){
		bpmnjs.invoke(function( modeling ) {
				var selectedElements = getSelecteds();
				if (selectedElements.length){
					modeling.removeElements(selectedElements.slice());	
				}
		}) 				
	}		
	
	/* Adiciona um elemento na tela  */
	/*
	Exemplo :
		createShape('shape' , { type : 'bpmn:IntermediateCatchEvent' , {x: 400 , y:400} , getElementById('Process_1') }	 , 'bpmn:TimerEventDefinition' );
		retorna o element criado
	*/
	function createShape( elementAttrs , position , parent , eventType ){
		var el;
		bpmnjs.invoke(function(modeling , elementFactory , moddle) {
			el = elementFactory.create('shape', elementAttrs );
			
			if( eventType ){	
			  var eventDefinitions = el.businessObject.get('eventDefinitions'),
				  eventDefinition = moddle.create(eventType);
		
			  eventDefinitions.push(eventDefinition);
			}
		
			modeling.createShape( el , position , parent , false );
			
		})	
		return el;  			
	}
	
	/* Adiciona uma conexao entre 2 elementos  */
	/*
	Exemplo :
		createConnection(source, target, {type:'bpmn:SequenceFlow'} , getElemById('Process_1') )
	*/	
	function createConnection(source, target, targetIndex, connection ){
		var el;
		bpmnjs.invoke(function(modeling) {
			el = modeling.createConnection(source, target, targetIndex, connection );
		})
		return el;	
	}
	
	
	/* Exibe um icone conectado com uma Atividade informando se tem uma Ação de Envio de Email ou uma Alerta  */
	/*
	Exemplo :	
		showAlerta( getSelected() , 'acaoEnvioEmail' , 1 );
	*/		
	function showAlertaIcone( element , tipo , iconeNum , status ){
		/*distancia entre um icone e outro */
		var distIcones = 45;
	
		/* seleciono o icone que vai swer exibido */
		switch( tipo ){
			case 'acaoEnvioEmail':
				icon_eventDefinition = 'bpmn:MessageEventDefinition';
				type_eventDefinition = 'bpmn:IntermediateCatchEvent';
				posX = 10 - ( iconeNum * distIcones );
				break;
			case 'alerta':
				icon_eventDefinition = 'bpmn:MessageEventDefinition';
				type_eventDefinition = 'bpmn:IntermediateThrowEvent';
				posX = 90 + ( iconeNum * distIcones );
				break;						
		}							
		
		/* crio o shape com o icone dentro*/
		var acao = createShape( 
			{ type : type_eventDefinition }  , 
			{x: ( element.x + posX ) , y: ( element.y - 50 ) } , 
			element.parent , 
			icon_eventDefinition 
		);
		/* crio conexao com element */
		createConnection( 
			element , 
			acao, 
			{type:'bpmn:DataOutputAssociation'} , 
			element.parent 
		);
		
		/* seto o status */
		setAttribute( acao.id , '_wiseit_status' , status );

	}	
	
	/* Exibe um icone na Atividade informando se o responsavel é um Worker ou se a Ativideade é uma Atividade Automatica  */
	/*
	Exemplo :	
		showTipoAtividadeIcon( 'worker' );
	*/		
	function showTipoAtividadeIcone( type ){
			
			if( type == 'WORKER')
				iconeType = 'bpmn:ScriptTask'; 
			else if( type == 'ATIVIDADE_AUTOMATICA')
				iconeType = 'bpmn:ServiceTask'; 
			else
				iconeType = 'bpmn:Task'; 
			
			_wiseit_codigo_val = getAttribute( getSelectedId() , '_wiseit_codigo' );
				
			var oldElement = getSelected();
			var newElement = oldElement; 
			newElement.type = iconeType;
			
			bpmnjs.invoke(function(bpmnReplace) {
				/* seto para true flgIsReplace para nao excluir a task no shape.removed */
				//flgIsReplace = true;
				flagSalvar = false;
				/* Replace */
				bpmnReplace.replaceElement(oldElement, newElement);
				flagSalvar = true;
				// seto o codigo da atividade
				setAttribute( getSelectedId() , '_wiseit_codigo' , _wiseit_codigo_val );
			})	
				
	}
	
		
	/* Retorna o label disponivel para setar o nome Atividade */
	function getLabelAtividade(){
		var maior = '0';
		bpmnjs.get('canvas')._elementRegistry.forEach( 
			function(e){
				//console.log(e.id)
				if(e.businessObject.name && isTask( e.type ) ){
					var num = e.businessObject.name.toUpperCase().replace( 'ATIVIDADE ' , '' );
					if( ! isNaN( num ) && num > maior )
						maior = num;
				}
									
			} 
		)
		return 'ATIVIDADE ' + ( parseInt(maior) + 1 );		
	}
	
	/* Retorna o label disponivel para setar o nome do Processo */
	function getLabelProcesso(){
		var maior = '0';
		bpmnjs.get('canvas')._elementRegistry.forEach( 
			function(e){
				//console.log(e.id)
				if(e.businessObject.name && e.type == 'bpmn:SubProcess' ){
					var num = e.businessObject.name.toUpperCase().replace( 'PROCESSO EXTERNO ' , '' );
					if( ! isNaN( num ) && num > maior )
						maior = num;
				}
									
			} 
		)
		return 'PROCESSO EXTERNO ' + ( parseInt(maior) + 1 );		
	}	


	/* Retorna true se o type é uma Task */
	function isTask( type ){
		switch( type ){
		  case 'bpmn:Task':
		  	return true;
			break;
		  case 'bpmn:ServiceTask':
			return true;
			break;
		  case 'bpmn:ScriptTask':
			return true;
			break;
		}
		return false;
	}	
	
	
	/* Retorna o numero de elementos no desenho , 
		param : type 
		example : getNumElements('bpmn:Participant') */
	function getNumElements( type ){
		var num = 0;
		bpmnjs.get('canvas')._elementRegistry.forEach( 
			function(e){
				//console.log(e.id)
				if(e.type == type )
					num++;
									
			} 
		)
		return num;		
	}		
	
	
	/* Cancela edicao do label */
	function cancelLabelEdit(){
		setTimeout( function(){
			bpmnjs.invoke(function(directEditing) {
				directEditing.cancel();
			}) 
		} , 10 );		
	}
	
	/* Limpa historico do UNDO */
	function clearUndoHistory(){
		setTimeout( function(){
			bpmnjs.invoke(function(commandStack) {
				commandStack.clear();
			}) 
		} , 10 );		
	}

	/* Inject valicações Wiseit */
	function injectValidacao(){
	
		bpmnjs.invoke(function(rules) { 
		
			/* bpmn-modeler.js	*/
			/*		
			Rules.prototype.allowed = function(action, context) {
			  var allowed = this._commandStack.canExecute(action, context);
			
			  // map undefined to true, i.e. no rules
			  return allowed === undefined ? true : allowed;
			}
			*/				
			 	
			rules.allowed = function(action, context){
				
				// inject
				//console.log(e);
				//console.log(t);
				wiseitPermitir.valida(action, context);
				if( wiseitPermitir.existe ){
					return wiseitPermitir.retorno;
				}
				// fim inject
				
				var allowed = this._commandStack.canExecute(action, context);
				
				// map undefined to true, i.e. no rules
				return allowed === undefined ? true : allowed;
			} 

		}) 	
		
	}
	
	/* limpaLixo */
	/* esta funcao limpa lixo grafico da tela 
		por exemplo icones de envio de email ou alertas
	*/
	function limpaLixo(){
		/* limpo as conexoes da atividade ( Acoes de envio de meial , etc.. ) para recriar */
		var lixo = [];
		bpmnjs.get('canvas')._elementRegistry.forEach( 
			function(e){
				/* icones de envio de email e alerta orfans */
				if( e.type == 'bpmn:IntermediateCatchEvent' ){
					if( e.incoming.length == 0 ) // não tem conexao
						lixo.push( e.id );
				}	
			} 
		)	
		
		for( var y = 0 ; y < lixo.length ; y ++)
			removeElementById( lixo[y] );
		/* fim limpar */			
	}
	
	
	/* Exibe icone de block para ações não permitidas */
	var wiseitPermitir = {
		existe:false, // existe validacao
		retorno:false, 
		valida: function( action, context ){
			// valido os fluxos		
			if( action == 'shape.create' ){
				
				if( context.shape.type == "bpmn:Participant" && getNumElements('bpmn:Participant') > 0 ){
					this.existe = true;
					this.retorno = false; // bloqueia	
					return;								
				}
				
				if( context.shape.type == "bpmn:EndEvent" && getNumElements('bpmn:EndEvent') > 0 ){
					this.existe = true;
					this.retorno = false; // bloqueia	
					return;								
				}
				
				if( context.shape.type == "bpmn:StartEvent" && getNumElements('bpmn:StartEvent') > 0 ){
					this.existe = true;
					this.retorno = false; // bloqueia	
					return;								
				}								
				
			}


			
			if( action == 'shape.append' ){
				/* Bloqueia que uma desicao nao posso conectar com outra desicao */	
				if( context.shape.type == "bpmn:ExclusiveGateway" && context.source.type == "bpmn:ExclusiveGateway" ){ 
					this.existe = true;
					this.retorno = false; // bloqueia	
					return;				
				}

				/* Bloqueia que uma Task não pode conectar com mais de 1 Task */	
				if( ( isTask( context.shape.type ) || context.shape.type == "bpmn:SubProcess" ) && context.source.type != "bpmn:ExclusiveGateway" && context.source.outgoing.length > 0 ){
					
					if( context.source && context.source.outgoing && context.source.outgoing.length > 0 ){
						var numConexoes = 0;
						for( var x = 0 ; x < context.source.outgoing.length ; x++ ){
							if( context.source.outgoing[x].type != "bpmn:DataOutputAssociation" )
								numConexoes++; // so conto as linhas que não sao as ponteadas ( informação da atividade - icone de Acao de email por examplo )
							
						}
						if( numConexoes > 0 ){
							/*
							console.log( context );
							console.log( action );
							console.log('-------------------- task mais de uma conexao');
							*/
							this.existe = true;
							this.retorno = false; // bloqueia	
							return;					
						}
					}
				}
					
					
			}
			
			
			if( action == 'connection.create' ){
				
				// destino é uma condicao					
				if( context.target.type == "bpmn:ExclusiveGateway" ){ 
					
					// Bloqueia
					// existe mais de um origem para condicao
					if( context.target.incoming.length > 0 ){ 
						//console.log('existe mais de um origem para condicao');
						this.existe = true;
						this.retorno = false; // bloqueia	
						return;
					}	
											
				}
				
				// origem é uma condicão
				if( context.source.type == "bpmn:ExclusiveGateway" ){ 	
					
					// Bloqueia
					// não existe fluxo de origem para condicao
					if( ! existeFluxoEntrada( context.source.id ) ){ 
						//console.log('não existe fluxo de origem para condicao');
						this.existe = true;
						this.retorno = false; // bloqueia	
						return;
					}						
					
				}
				
				// destino é um pool					
				if( context.target.type == "bpmn:Participant" ){ 
					//console.log('não é permitido conneções com pools');
					this.existe = true;
					this.retorno = false; // bloqueia	
					return;
				}	

				// origem é uma ação de envio de email
				if( context.source.type == "bpmn:IntermediateCatchEvent" ){ 
					//console.log('não é permitido conneções com pools');
					this.existe = true;
					this.retorno = false; // bloqueia	
					return;				
				}
				
				// destino é IntermediateCatchEvent ou IntermediateThrowEvent uma ação de envio de email
				if( context.target.type == "bpmn:IntermediateCatchEvent" || context.target.type == "bpmn:IntermediateThrowEvent" ){ 
					//console.log('não é permitido conneções com pools');
					this.existe = true;
					this.retorno = false; // bloqueia	
					return;				
				}				
		
				/* Bloqueia que uma Task não pode conectar com mais de 1 Task */	
				if( ( isTask( context.target.type ) || context.target.type == "bpmn:SubProcess" ) && context.source.type != "bpmn:ExclusiveGateway" && context.source.outgoing.length > 0 ){
					
					if( context.source && context.source.outgoing && context.source.outgoing.length > 0 ){
						var numConexoes = 0;
						for( var x = 0 ; x < context.source.outgoing.length ; x++ ){
							if( context.source.outgoing[x].type != "bpmn:DataOutputAssociation" )
								numConexoes++; // so conto as linhas que não sao as ponteadas ( informação da atividade - icone de Acao de email por examplo )
							
						}
						if( numConexoes > 0 ){
							this.existe = true;
							this.retorno = false; // bloqueia	
							return;					
						}
					}
				}				
								
				
			}
			this.existe = false;

		}

		
	};
	/* fim inject valicações Wiseit */
	
	
	
	/* Valida que não existem desiçoes sem fluxos antes de salvar */
	function validaCondicao(){
		var match_ = false;
		bpmnjs.get('canvas')._elementRegistry.forEach( 
			function(e){
				if( e.type == 'bpmn:ExclusiveGateway' && !match_ ){
					
					if( e.incoming.length == 0 && e.outgoing.length == 0 ){ // seta desde e ate
						msgwiseit("exclamacao", 'Condição sem fluxo de entrada nem de saida.', 'Ok,fecharmsg()');
						setSelected( e );
						match_ = true;
					}else if( e.incoming.length == 0 ){ // seta desde
						msgwiseit("exclamacao", 'Condição sem fluxo de entrada.', 'Ok,fecharmsg()');
						setSelected( e );
						match_ = true;
					}else if( e.outgoing.length == 0 ){ // seta ate
						msgwiseit("exclamacao", 'Condição sem fluxo de saida.', 'Ok,fecharmsg()');
						setSelected( e );
						match_ = true;
					}
					
				}	

			} 
		)			
	}	
	/* Fim valida que não existem desiçoes sem fluxos antes de salvar */

	/*
		showTipoAtividadeIcone( 'worker' );
		showAlertaIcone( getSelected() , 'acaoEnvioEmail' , 0);
		showAlertaIcone( getSelected() , 'acaoEnvioEmail' , 1);
		showAlertaIcone( getSelected() , 'alerta' , 0 );
		showAlertaIcone( getSelected() , 'alerta' , 1 );
		showAlertaIcone( getSelected() , 'alerta' , 2 );	
	*/						

	function limpaIconesTipoAtividade( codTipoAtividade ){
		var atv = getElemByWiseitCodigo( codTipoAtividade );
		lixo = [];
		for( var c = 0 ; c < atv.outgoing.length ; c++ ){
			if( atv.outgoing[c].type == "bpmn:DataOutputAssociation" )
				lixo.push( atv.outgoing[c].target.id );
		}	
		
		for( var y = 0 ; y < lixo.length ; y ++)
			removeElementById( lixo[y] );		
		
		setSelected( atv );		
	}
	
	
	/*  Exibe icones ao carregar em todas as Atividades 	*/
	function showIconesTipoAtividadeOnLoad(){
		bpmnjs.get('canvas')._elementRegistry.forEach( 
			function(e){
				//console.log(e.id)
				if( isTask( e.type ) ){
					var codigo = getAttribute( e.id , '_wiseit_codigo' );
					showIconesTipoAtividade( codigo );
				}
									
			} 
		)	
	}		
	
	/* Exibe icones nas Atividade */
	function showIconesTipoAtividade( codTipoAtividade ){
				
		limpaIconesTipoAtividade( codTipoAtividade );
		
		// Descrição = Worker|Atividade Automatica
		/* console.log( findDescTipoAtividade( codTipoAtividade ) ); */ 
		var atividade = findDescTipoAtividade( codTipoAtividade );
		if( atividade && atividade.responsavel && atividade.responsavel.usuario && atividade.responsavel.usuario.tipo ){
			
			//if( atividade.responsavel.usuario.tipo == 'WORKER' )
			//showTipoAtividadeIcone( 'WORKER' );
			showTipoAtividadeIcone( atividade.responsavel.usuario.tipo );
			
			console.log( 'atividade.responsavel.usuario.tipo :' + atividade.responsavel.usuario.tipo );	
			/*
			
			ATIVIDADE_AUTOMATICA
			
			WORKER
			
			USUARIO
		
			*/
			
		}		
		
		
		/* limpo os icones para recriar */
		//limpaLixo()
		
		// Ação
		/* console.log( findAcoesTipoAtividade( codTipoAtividade ) ); */
		var acoes = findAcoesTipoAtividade( codTipoAtividade );
		if( acoes && acoes.length ){
			for( var i = 0 ; i<acoes.length ; i++){
				/* acao de envio de email */
				if( acoes[i].acao.tipoAcao.nome == 'ENVIO DE EMAIL' ){
					/*					
					console.log('codigo :' + acoes[i].acao.codigo );
					console.log('nome :' + acoes[i].acao.nome );		
					
					console.log('codigo :' + acoes[i].acao.tipoAcao.codigo );
					console.log('nome :' + acoes[i].acao.tipoAcao.nome );								
					
					console.log('status.codigo :' + acoes[i].status.codigo );
					console.log('status.nome :' + acoes[i].status.nome );
					
					console.log('status.codigo :' + acoes[i].tipoAtividade.codigo );
					console.log('status.nome :' + acoes[i].tipoAtividade.nome );
					*/
					var status = '<b>A&ccedil;&atilde;o associada</b> ' + atividade.nome + ' &nbsp; | &nbsp; <b>Tipo de a&ccedil;&atilde;o :</b> ' + acoes[i].acao.tipoAcao.nome + ' &nbsp; | &nbsp; <b>A&ccedil;&atilde;o :</b> ' + acoes[i].acao.nome + ' &nbsp; | &nbsp; <b>Status :</b> ' + acoes[i].status.nome;
										
					// exibe icone
					showAlertaIcone( getSelected() , 'acaoEnvioEmail' , i , status );												
										
				}
			}
		}
		
		// Alertas
		/* console.log( findAlertasTipoAtividade( codTipoAtividade ) ); */
		var alertas = findAlertasTipoAtividade( codTipoAtividade );
		if( alertas && alertas.length ){
			for( var i = 0 ; i<alertas.length ; i++){
				/* acao de envio de email */
				if( alertas[i].acao.tipoAcao.nome == 'ENVIO DE EMAIL' ){
					/*
					console.log('codigo :' + alertas[i].codigo );
					console.log('inicioPorcentagem :' + alertas[i].inicioPorcentagem );
					console.log('numRepeticoes :' + alertas[i].numRepeticoes );
					console.log('tmpInicio :' + alertas[i].tmpInicio );
					console.log('tmpIntervalo :' + alertas[i].tmpIntervalo );
	
					console.log('acao.codigo :' + alertas[i].acao.codigo );
					console.log('acao.nome :' + alertas[i].acao.nome );
					console.log('acao.tipoAcao.codigo :' + alertas[i].acao.tipoAcao.codigo );
					console.log('acao.tipoAcao.nome :' + alertas[i].acao.tipoAcao.nome );	
					
					console.log('tipoAtividade.codigo :' + alertas[i].tipoAtividade.codigo );
					console.log('tipoAtividade.nome :' + alertas[i].tipoAtividade.nome );
					*/
					
					var tempoInicio = '';
					if( eval( alertas[i].inicioPorcentagem ) ){
						tempoInicio = alertas[i].tmpInicio + ' %';
					}else{
						tempoInicio = alertas[i].tmpInicio + ' min';
					}
						
					var status = '<b>Alerta associada</b> ' + atividade.nome + ' &nbsp; | &nbsp; <b>Tipo de a&ccedil;&atilde;o :</b> ' + alertas[i].acao.tipoAcao.nome + ' &nbsp; | &nbsp; <b>A&ccedil;&atilde;o :</b> ' + alertas[i].acao.nome + ' &nbsp; | &nbsp; <b>Tempo Inicio :</b> ' + tempoInicio + ' &nbsp; | &nbsp; <b>Repeti&ccedil;&otilde;es :</b> ' + alertas[i].numRepeticoes + ' &nbsp; | &nbsp; <b>Intervalo :</b> ' + alertas[i].tmpIntervalo;					
					// exibe icone
					showAlertaIcone( getSelected() , 'alerta' , i , status );	
					
				}
			}
		}
		
		applyStyles();
		
	}	
	
	
	/*******************************************/
	/*           Export v1 to V2               */
	/*******************************************/

	function getDadosDesenhoVersao1( tipoAtividade ){
		/*
		@GET 
		/CCenterWeb/rest/workflow/pesquisa/dadosdesenho/{codTipoAtividade}
		
		*/ 	
		var ret;
		$.ajax({
			async:false,
			type: 'GET',
			data: '',
			url: "/CCenterWeb/rest/workflow/pesquisa/dadosdesenho/" + tipoAtividade,
			success: function( dados ){
				ret = dados;
			},
			error: function(xhr,err){
				console.log( xhr.responseText );
			}
		});		
		return ret;					
	}


	function exportarParaVersao2( tipoAtividade ){
		
		var dados = getDadosDesenhoVersao1( tipoAtividade );		
				
		flagSalvar = false; // o exportar é so visual , não tem que criar fluxos , atividades , etc...
		
		/* Atividades */
		/* valido os dados */
		if( dados[0].processo[0].atividades ){		
		
			var atividades = dados[0].processo[0].atividades; 
			for( var i = 0 ; i< atividades.length ; i++ ){
				
				var tipoBpmn;
				if( atividades[i].tipo == 'atividade' ){ /* atividades*/
					/* tipos de atividade, exibe um icone diferente */
					tipoBpmn = 'bpmn:Task';
					if( atividades[i].isWorker ){
						tipoBpmn = 'bpmn:ScriptTask';
					}else if( atividades[i].isAtividadeAutomatica ){
						tipoBpmn = 'bpmn:ServiceTask';
					}
	
				}else{ /* processos */
					tipoBpmn = 'bpmn:SubProcess';		
				}
				
				var shape = createShape( { type : tipoBpmn , name : atividades[i].name } , {x: atividades[i].position[0].x , y:atividades[i].position[0].y} , getElemById('Process_1') );				
				setAttribute( shape.id , '_wiseit_codigo' , atividades[i].cod );
				setAttribute( shape.id , 'name' , atividades[i].name );
				//console.log( shape ); 			
	
			}
		
		}
		
		
		/* Fluxos */
		/* valido os dados */
		if( dados[0].processo[0].fluxos ){
			var fluxos = dados[0].processo[0].fluxos; 
			for( var x = 0 ; x< fluxos.length ; x++ ){
	
				if( fluxos[x].origem != null && fluxos[x].destino != null ){
	
					if( fluxos[x].tipo == 'fluxo' ){ /* fluxos */
						
						var origem = getElemByWiseitCodigo( fluxos[x].origem[0].cod );
						var destino = getElemByWiseitCodigo( fluxos[x].destino[0].cod );
						/* conexao */
						var con = createConnection(origem, destino, {type:'bpmn:SequenceFlow'} , getElemById('Process_1') );
						setAttribute( con.id , '_wiseit_codigo' , fluxos[x].cod );
						
					}else{ /* condicao */
	 
						var origem = getElemByWiseitCodigo( fluxos[x].origem[0].cod );
						var destino = getElemByWiseitCodigo( fluxos[x].destino[0].cod );
						
						var condicao;
						if( origem.outgoing.length > 0 ) /* se existe condicao utilizao a ja criada */
							condicao = origem.outgoing[0].target;
						else{	/* crio condicao */
							condicao = createShape( { type : 'bpmn:ExclusiveGateway' } , { x: origem.x + 200 , y: origem.y + 40 } , getElemById('Process_1') );	
							createConnection( origem, condicao , {type:'bpmn:SequenceFlow'} , getElemById('Process_1') );
						}
						
						/* conexoes */
						var con = createConnection( condicao , destino , {type:'bpmn:SequenceFlow'} , getElemById('Process_1') );
						setAttribute( con.id , '_wiseit_codigo' , fluxos[x].cod );
						
					}
					
				}
			
			}
		}

		
		/* Start */
		/* valido os dados */
		if( dados[0].processo[0].start ){
			var start = dados[0].processo[0].start; 
			

			
			for( var x = 0 ; x< start.length ; x++ ){

				/* muda a position default do start para nao ficar atraz das ferramentas */
				var start_position_x = start[x].position[0].x; 
				if( start_position_x  == '30.0') /* valor default */
					start_position_x  = '100.0';				
				
				var shape = createShape( { type : 'bpmn:StartEvent' } , {x: start_position_x , y:start[x].position[0].y} , getElemById('Process_1') );	
				if( start[x].destino != null ){	
					for( var y = 0 ; y< start[x].destino.length ; y++ ){	
						var destino = getElemByWiseitCodigo( start[x].destino[y].cod );
						var con = createConnection( shape , destino , {type:'bpmn:SequenceFlow'} , getElemById('Process_1') );
						//setAttribute( con.id , '_wiseit_codigo' , fluxos[x].cod );						
					}
				}
			}
		}
		
		/* End */
		/* valido os dados */
		if( dados[0].processo[0].end ){
			var end = dados[0].processo[0].end; 
			
			for( var x = 0 ; x< end.length ; x++ ){
				var shape = createShape( { type : 'bpmn:EndEvent' } , {x: end[x].position[0].x , y:end[x].position[0].y} , getElemById('Process_1') );	
				if( end[x].origem != null ){	
					for( var y = 0 ; y< end[x].origem.length ; y++ ){	
						var origem = getElemByWiseitCodigo( end[x].origem[y].cod );
						var con = createConnection( origem , shape , {type:'bpmn:SequenceFlow'} , getElemById('Process_1') );
						//setAttribute( con.id , '_wiseit_codigo' , fluxos[x].cod );						
					}
				}
			}
		}		
		
		
		flagSalvar = true; 
		applyStyles();
		
	}



	/******************************************/
	/*           Fim Export v1 to V2          */
	/******************************************/
	
	
	
	
	/* Adiciona os tooltips na versao Viewer 
		doc:
			http://www.w3schools.com/bootstrap/tryit.asp?filename=trybs_tooltip_pos&stacked=h
		exemplo :
			addTooltip( '1821' , 'Actividade lalal' );
			addTooltip( '1820' , 'Actividade 1980' );		
				
	*/
	function addTooltip( codigo , descricao ){
	
		/* mouse over */
		$( '.wiseit_codigo_' + codigo ).mouseover(function(){ 
	
			/*crio uma div com o id da class do svg que exibe o tooltip */
			if( ! document.getElementById('wiseit_codigo_' + codigo) ){		
				var offset = $( this ).offset();
				var div = document.createElement('div');
				div.setAttribute('id' , 'wiseit_codigo_' + codigo );	
				div.setAttribute('style' , 'position:absolute; top:' + ( $( this ).offset().top + 20 ) + 'px; left:' + ( $( this ).offset().left + 110) + 'px; background-color:#009; width:0px; height:0px;');	
				div.setAttribute('data-toggle' , 'tooltip');
				div.setAttribute('data-html' , 'true');
				div.setAttribute('data-placement' , 'right');
				div.setAttribute('data-title' , descricao );		
				document.body.appendChild(div);							
			}
			
			$('#wiseit_codigo_' + codigo).tooltip('show');  /* div */
	
		});	
		
		/* mouse over */
		$('.wiseit_codigo_' + codigo).mouseout(function(){ 
			$('#wiseit_codigo_' + codigo).tooltip('hide'); /* div */
		});												
		
	}	
		

	var BpmnJS = window.BpmnJS;
	var bpmnjs;

	/* Inicializa Versão Modeler ( editavel ) */
	function initModeler( canvas ){
		bpmnjs = new BpmnJS({ container: canvas , additionalModules: [ contextPadModule , paletteModule , eventsModule ] });	
	}
	
	/* Inicializa Versão Viewer ( readonly ) */
	function initViewer( canvas ){
		bpmnjs = new BpmnJS({container: canvas });
	}	
 	
