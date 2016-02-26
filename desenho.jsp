<%@ taglib uri="/tags/jstl-core" prefix="c" %>
<%@ taglib uri="/tags/struts-bean" prefix="bean" %>
<%@ taglib uri="/tags/struts-logic" prefix="logic" %>
<%@ taglib uri="/tags/ccenter" prefix="ccenter" %>
<%@ taglib uri="/tags/jstl-function" prefix="fn"%>


<c:import url="/jsp/Common/doctype.jsp" context="/CCenterWeb/" />
<html>
<head>
	<%@ include file="/jsp/Common/headerConteudo.jsp"%> 
<meta http-equiv="Content-Type" content="text/html;charset=utf-8" >
  <link rel="stylesheet" href="<ccenter:linkver src="/CCenterWeb/css/padrao.css"/>" type="text/css" />	
  <!--
  <link rel="stylesheet" href="/CCenterWeb/scripts/bower-bpmn-js-master/test/bower_components/bpmn-js/dist/assets/diagram-js.css">
  <link rel="stylesheet" href="/CCenterWeb/scripts/bower-bpmn-js-master/test/bower_components/bpmn-js/dist/assets/bpmn-font/css/bpmn.css">
  <link rel="stylesheet" href="/CCenterWeb/scripts/bower-bpmn-js-master/test/bower_components/bpmn-js/dist/assets/bpmnio-font/css/bpmnio.css">
  <link rel="stylesheet" href="/CCenterWeb/scripts/bower-bpmn-js-master/test/bower_components/bpmn-js/dist/assets/style_custom.css"> 
  -->
  
  
  <link rel="stylesheet" href="/CCenterWeb/scripts/bpmn-js-seed-master/bower_components/bpmn-js/dist/assets/diagram-js.css">
  <link rel="stylesheet" href="/CCenterWeb/scripts/bpmn-js-seed-master/bower_components/bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css"> 
  <link rel="stylesheet" href="/CCenterWeb/scripts/bpmn-js-seed-master/bower_components/bpmn-js/dist/assets/bpmnio-font/css/bpmnio.css"> 
  <link rel="stylesheet" href="/CCenterWeb/scripts/bpmn-js-seed-master/bower_components/bpmn-js/dist/assets/style_custom.css"> 
	
	<script language="Javascript" type="text/javascript">
		wiseit.include("frame");
	<!--

/*

- Atividade = bpmn:Task
	Atributos xml :
		_wiseit_codigo
		
- Condi??o = bpmn:ExclusiveGateway
	Atributos xml :
		_wiseit_codigo	

- Fluxo = bpmn:SequenceFlow
	Atributos xml :
		_wiseit_codigo

- Processo = bpmn:ServiceTask
	Atributos xml :
		_wiseit_codigo
		
- Inicio = bpmn:StartEvent
- Fim = bpmn:EndEvent



alert('${pageContext.request.locale.language}');
alert('${pageContext.request.locale}');
alert('${pageContext.request.locale.country}');
alert('${tipoProcesso.codTipoProcesso}');
alert('${sessionScope.SESSAO_RESOLUCAO_LARGURA_TELA}')
alert('${sessionScope.SESSAO_RESOLUCAO_ALTURA_TELA}')

<ccenter:controleacesso>
	<ccenter:when recurso="CADASTRO DE PROCESSO" permissao="CADASTRAR">
		alert('CADASTRAR');
	</ccenter:when>
</ccenter:controleacesso>
<ccenter:controleacesso>
	<ccenter:when recurso="CADASTRO DE PROCESSO" permissao="EXCLUIR">
		alert('EXCLUIR');
	</ccenter:when>
</ccenter:controleacesso>
*/

	var language = '${pageContext.request.locale.language}';
	var country = '${pageContext.request.locale.country}';
	var codTipoProcesso = '${tipoProcesso.codTipoProcesso}';
	var SESSAO_RESOLUCAO_LARGURA_TELA = '${sessionScope.SESSAO_RESOLUCAO_LARGURA_TELA}';
	var SESSAO_RESOLUCAO_ALTURA_TELA = '${sessionScope.SESSAO_RESOLUCAO_ALTURA_TELA}';

	function Init(){
		msgwiseit("ampuleta",'<bean:message key="msg.ampuleta.aguarde" /> ',"");
		novaVersaoTipoProcesso( codTipoProcesso , 'novoProcesso' );
	}
	
//------------------------------------------------------------------------------

	var tela;	
	function abreTelaAtividade(codTipoAtividade){
		try{

			linkAction = '/CCenterWeb/Workflow/TipoAtividade.dm?method=abrir&codTipoAtividade=' + codTipoAtividade;
			tela = wiseit.frame.novoFrame("telaPropriedades", linkAction );
			tela.show();

			return codTipoAtividade;
		} catch(e){
			alert(e);
		}
	}
	
	function abreTelaAtividadeProcessoExterno(codTipoAtividade){
		try{
			
			linkAction = '/CCenterWeb/Workflow/TipoAtividade.dm?method=abrir&processoExterno=true&codTipoAtividade=' + codTipoAtividade;
			tela = wiseit.frame.novoFrame("telaPropriedades", linkAction );
			tela.show();			
			
		} catch(e){
			alert(e);
		}
	}
	
	function fechaTelaAtividade(codTipoAtividade, nmeTipoAtividade){
		
		if( nmeTipoAtividade && nmeTipoAtividade.indexOf(' - ') > -1 )
			nmeTipoAtividade = nmeTipoAtividade.split(' - ')[0];
		/* nmeResponsavel */
		/* nmeTipoAtividade.split(' - ')[1] */
		
		if(codTipoAtividade != null && nmeTipoAtividade != null){
			updateTipoAtividade(codTipoAtividade, nmeTipoAtividade);
		
			/* exibe os icones de email e de alertas */
			showIconesTipoAtividade( codTipoAtividade );			
		}

		tela.hide(true);
		window.focus();
	}

//------------------------------------------------------------------------------
	function abreTelaCondicao(codTipoProcesso, codsFluxo, isStart, codFluxoDefault){
		try{
		    var url = '/CCenterWeb/Workflow/CondicaoFluxo.dm?method=visualizar&flgTipoFluxo=condicao';
		    url += '&codTipoProcesso=' + codTipoProcesso;
		    url += '&codsFluxo=';
			if(codsFluxo != null)
				 url += codsFluxo;
		    url += '&isStart=' + isStart;

			if(codFluxoDefault != null)
			    url += '&codFluxo=' + codFluxoDefault;

			tela = wiseit.frame.novoFrame("telaPropriedades", url );
			tela.show();
			
		} catch(e){
			alert(e);
		}
	}
	
	function abreTelaFluxo(codTipoProcesso, isStart, codFluxo){
		try{
			if(codFluxo == null){
				alert('N�o pode-se abrir a tela de fluxo sem codFluxo');
			}
			else{
		    	var url = '/CCenterWeb/Workflow/CondicaoFluxo.dm?method=visualizar&flgTipoFluxo=simples';
			    url += '&codTipoProcesso=' + codTipoProcesso;
			    url += '&isStart=' + isStart;
			    url += '&codFluxo=' + codFluxo;
	
				tela = wiseit.frame.novoFrame("telaPropriedades", url );
				tela.show();
			
			}
		} catch(e){
			alert(e);
		}
	}
	
	function fechaTelaCondicao(){
		tela.hide(true);
		window.focus();
	}

	//------------------------------------------------------------------------------

	//Fecha esta tela. Tela de cadastro de TipoProcessso (Applet)
	function fecharTelaDesenho(){
		parent.fecharTelaDesenho();
	}
	
	function updateTipoAtividade(codTipoAtividade, nmeTipoAtividade){
		if(codTipoAtividade != null && codTipoAtividade != '')
			setAttribute( getSelectedId() , 'name' , nmeTipoAtividade );
	}

	function updateFluxo(codFluxo, nmeDestinoFluxo){
		if(codFluxo != null && codFluxo != '')
			setAttribute( getSelectedId() , 'name' , nmeDestinoFluxo );
	}



	document.onkeypress = function(e){
		//return _onkeypress(e);
	}
	
	/*
	function _onkeypress(e){
		if(e && e.which){ //if which property of event object is supported (NN4)
			e = e;
			characterCode = e.which; //character code is contained in NN4's which property
		}else{
			e = e;
			characterCode = e.keyCode; //character code is contained in IE's keyCode property
		}		
		
		return KeyPress(e);		
		
	}*/


	function callRest(callbackid, params) {
		flagLoadRest = true;
		console.log('flagLoadRest :' + flagLoadRest);
		console.log('callRest :' + callbackid + ' - ' + params);
		params.error = function(xhr,err){
			var obj;
			try {
				eval("obj = "+xhr.responseText);
			} catch(eeeee) {}
			var m;
			if(obj)
				m = obj
			else if(xhr.responseText)
				m  = {"error" : -1 ,"message" : xhr.responseText};
			else if(xhr.statusText)
				m  = {"error" : -1 ,"message" : xhr.statusText};
			else
				m  = {"error" : -1 , "message" : "Erro indefinido " + xhr.status};
			
			
			flagLoadRest = false;
			console.log('flagLoadRest :' + flagLoadRest);			
			//document.getElementById("myApplet").restError(callbackid,JSON.stringify(m) );
			console.log('params.error :' + callbackid + ' - ' + params);
			console.log('error :' + JSON.stringify(m));
			//alert('error : ' + JSON.stringify(m) )
		};

		params.success = function(t) {
			 //alert(callbackid);
			 //alert(JSON.stringify(t));
			 
			flagLoadRest = false;
			console.log('flagLoadRest :' + flagLoadRest);				 
			console.log('params.success :' + t);
						
			if( callbackid == 'novoProcesso'){

				// novo codTipoProcesso da versão
				if( t && t.tipo && t.tipo.codigo )
					codTipoProcesso = t.tipo.codigo; // para a versao 2 na funcao exportarParaVersao2 tem que passar o codTipoProcesso novo.
				
				/* versao 2 */
				if( t.xmlDesenho.indexOf( 'java.beans.XMLDecoder' ) == -1  )
					importXML( t.xmlDesenho );
				else /* versao 2 */
					exportarParaVersao2( codTipoProcesso );	
												
				fecharmsg();
				return;	
			}
			
			if( t && t != '' ){				
				setAttribute( callbackid , '_wiseit_codigo' , JSON.stringify(t) );
			}
					
		};

		$.ajax(params);
	}


	function createAtividade(tipo, callbackid) {
		console.log( 'createAtividade : ' + tipo + ' - ' + callbackid  );
		params = {
			type: 'POST',
			url: "/CCenterWeb/rest/workflow/cadastro/tipoatividade",
			data: JSON.stringify(tipo),
		    contentType: "application/json; charset=utf-8",
		    dataType: "json"
			
			
		};

		callRest(callbackid, params);
	}

	function createFluxoOrigem(origem, callbackid) {
		console.log( 'createFluxoOrigem : ' + origem + ' - ' + callbackid  );
		params = {
			type: 'POST',
			url: "/CCenterWeb/rest/workflow/cadastro/origemfluxo",
			data: JSON.stringify(origem),
		    contentType: "application/json; charset=utf-8",
		    dataType: "json"
			
			
		};

		callRest(callbackid, params);
	}

	function createFluxoDestino(origem, callbackid) {
		console.log( 'createFluxoDestino : ' + origem + ' - ' + callbackid  );
		params = {
			type: 'POST',
			url: "/CCenterWeb/rest/workflow/cadastro/destinofluxo",
			data: JSON.stringify(origem),
		    contentType: "application/json; charset=utf-8",
		    dataType: "json"
			
			
		};

		callRest(callbackid, params);
	}

	function removeAtividade(tipo, callbackid) {
		console.log( 'removeAtividade : ' + tipo + ' - ' + callbackid  );
		params = {
			type: 'DELETE',
			url: "/CCenterWeb/rest/workflow/cadastro/tipoatividade/"+tipo,
		};

		callRest(callbackid, params);
	}

	function removeFluxoOrigem(origem, callbackid) {
		console.log( 'removeFluxoOrigem : ' + origem + ' - ' + callbackid  );
		params = {
			type: 'DELETE',
			url: "/CCenterWeb/rest/workflow/cadastro/origemfluxo/"+origem,
		};

		callRest(callbackid, params);
	}

	function removeFluxoDestino(destino, callbackid) {
		console.log( 'removeFluxoDestino : ' + destino + ' - ' + callbackid  );
		params = {
			type: 'DELETE',
			url: "/CCenterWeb/rest/workflow/cadastro/destinofluxo/"+destino,
		};

		callRest(callbackid, params);
	}

	function rollback(tipo, callbackid) {
		console.log( 'rollback : ' + tipo + ' - ' + callbackid  );
		params = {
			type: 'DELETE',
			url: "/CCenterWeb/rest/workflow/cadastro/tipoprocesso/"+tipo,
		};

		callRest(callbackid, params);
	}

	function removeProcessoExterno(tipo, callbackid) {
		console.log( 'removeProcessoExterno : ' + tipo + ' - ' + callbackid  );
		params = {
			type: 'DELETE',
			url: "/CCenterWeb/rest/workflow/cadastro/tipoatividade/"+tipo,
		};

		callRest(callbackid, params);
	}

	function novaVersaoTipoProcesso(tipo, callbackid) {
		console.log( 'novaVersaoTipoProcesso : ' + tipo + ' - ' + callbackid  );
		params = {
			type: 'PUT',
			data: '',
			url: "/CCenterWeb/rest/workflow/cadastro/tipoprocesso/"+tipo,
		};

		callRest(callbackid, params);
	}	

	function saveVisualData(save, callbackid) {
		/* svg */
		var b64Svg;
		bpmnjs.saveSVG(	function(err, svg) { 
			if( ! err ){
				//console.log(svg);
				b64Svg = svg;
			}
			
		}) 	
		
		/* xml */
		var b64Xml;		
		bpmnjs.saveXML(	function(err, xml) { 
			if( ! err ){
				//console.log(xml);
				b64Xml = xml;
			}
		}) 			


		try{
			var save = {
				"codigo" : codTipoProcesso, 
				"b64Xml" : btoa(b64Xml), 
				"b64Imagem" : btoa(b64Svg), 
				"numVersaoDesenho":2
			};
		}catch(e){
			if (e.code == DOMException.INVALID_CHARACTER_ERR) {
				msgwiseit("exclamacao", 'Desenho com caracteres invalidos.', 'Ok,fecharmsg()');
				return;
			}
			
		}

		params = {
			type: 'POST',
			url: "/CCenterWeb/rest/workflow/cadastro/tipoprocesso",
			data: JSON.stringify(save),
		    contentType: "application/json; charset=utf-8",
		    dataType: "json"
			
			
		};

		callRest(callbackid, params);
		
		parent.fecharTelaDesenho();

	}	
	
	
	/* Informa��o da tipo Atividade */	
	function findAcoesTipoAtividade( tipoAtividade ){
		/*
		@GET 
		/CCenterWeb/rest/workflow/pesquisa/acoestipoatividade/{codTipoAtividade} 
		*/
		var ret;
		$.ajax({
			async:false,
			type: 'GET',
			data: '',
			cache: false,			
			url: "/CCenterWeb/rest/workflow/pesquisa/acoestipoatividade/" + tipoAtividade,
			success: function( dados ){
				ret = dados;
			},
			error: function(xhr,err){
				console.log( xhr.responseText );
			}
		});		
		return ret;
					
	}
	
	function findAlertasTipoAtividade( tipoAtividade ){
		/* 
		@GET 
		/CCenterWeb/rest/workflow/pesquisa/alertastipoatividade/{codTipoAtividade} 	
		*/
		var ret;
		$.ajax({
			async:false,
			type: 'GET',
			data: '',
			cache: false,
			url: "/CCenterWeb/rest/workflow/pesquisa/alertastipoatividade/" + tipoAtividade,
			success: function( dados ){
				ret = dados;
			},
			error: function(xhr,err){
				console.log( xhr.responseText );
			}
		});		
		return ret;		
		
	}
	
	function findDescTipoAtividade( tipoAtividade ){
		/*
		@GET 
		/CCenterWeb/rest/workflow/pesquisa/tipoatividade/{codTipoAtividade}
		*/ 	
		var ret;
		$.ajax({
			async:false,
			type: 'GET',
			data: '',
			cache: false,
			url: "/CCenterWeb/rest/workflow/pesquisa/tipoatividade/" + tipoAtividade,
			success: function( dados ){
				ret = dados;
			},
			error: function(xhr,err){
				console.log( xhr.responseText );
			}
		});		
		return ret;					
	}


	
	-->
	</script>




</head>
<body class="intro" bgcolor="EFEFEF">


<!-- EXPORTA ARQUIVOS -->
<form id="export" name="export" action="/CCenterWeb/Workflow/TipoProcesso.dm" target="_self" method="post">

<input type="hidden" id="method" name="method"  value="exportarArquivosProcesso" />
<input type="hidden" id="tipoArquivo" name="tipoArquivo" />
<input type="hidden" id="nomeArquivo" name="nomeArquivo" />
<input type="hidden" id="xmlConteudo" name="xmlConteudo" />
<input type="hidden" id="imagemConteudo" name="imagemConteudo" />

</form>
<!-- EXPORTA ARQUIVOS -->


<div id="blehBG" style="display: none"></div>
<div id="bleh" style="position:relative ; width: 100%; height: 100%; z-index:6 ; display: none; overflow:hidden;">
<iframe name="telaPropriedades" id="telaPropriedades" allowtransparency="true" frameborder="0" src="" width="100%" height="100%"></iframe>
</div>

<table id="content" border="0">
<tr>
	<td align="center">
		<table width="${sessionScope.SESSAO_RESOLUCAO_LARGURA_TELA - 50}" border="0" cellpadding="0" cellspacing="0">
		<tr>
			<td style="background:url(/CCenterWeb/images/conteudo/abas/img_left_aba_conteudo_ON.gif)"></td>
			<td style="background-color:#DADADA; border-top:1px solid #828282; text-align:center; padding-left:5px; padding-right:5px;" nowrap="nowrap">
				<img src="/CCenterWeb/images/portal/icones/peq/ico_workflow.gif" style="vertical-align:middle;"/>
				<label class="cor_default aba negrito"><bean:message key="labels.processos.cadastro.workflow.titulo"/></label>
			</td>
			<td style="width:8px; background-color:#637494;"><img alt="" src="/CCenterWeb/images/conteudo/abas/img_right_aba_conteudo_ON.gif" /></td>
			<td style="width:${sessionScope.SESSAO_RESOLUCAO_LARGURA_TELA - 150}px;background-color:#637494">&#160;</td>
			<td style="width:8px;background:url(/CCenterWeb/images/conteudo/portal/img_right_top_conteudo.gif)"></td>
		</tr>
		<tr>
			<td style="height:11px; background:url(/CCenterWeb/images/conteudo/portal/img_left_conteudo.gif)">&#160;</td>
			<td colspan="3" bgcolor="#DADADA">
            <div style="height:3px"></div>
            <fieldset class="interno">
            <div style="height:5px"></div>
            
                <fieldset class="interno" style="height:${sessionScope.SESSAO_RESOLUCAO_ALTURA_TELA - 360}px; background-color:#FFF;">
    
                    <div class="content" id="js-drop-zone" >
                        <div class="canvas" id="js-canvas" style="background-color:#FFF;"  ></div>
                    </div>
                     
                    
					<script> 
                    
                    
                        function exportDesenho( tipo , nome ){ 
                         
                            // limpo
                            $('#imagemConteudo').val( '' );	
                            $('#xmlConteudo').val( '' );
                            $('#tipoArquivo').val( '' );
                            $('#nomeArquivo').val( '' );		
                    

							try{
                                
								if( tipo == 'xml' ){ /* xml */		
									var b64Xml = '';
									bpmnjs.saveXML(	function(err, xml) { 
										if( ! err ){
											b64Xml = xml;
										}
									}) 	
									
									$('#xmlConteudo').val( btoa(b64Xml) )							
								
								}else{ /* svg */	
									var b64Svg = ''; 
									bpmnjs.saveSVG(	function(err, svg) { 
										if( ! err ){
											b64Svg = svg;
										}
									})		
						
									$('#imagemConteudo').val( btoa(b64Svg) )	
						
								}
							
								$('#tipoArquivo').val( tipo )
								$('#nomeArquivo').val( nome )
						
								$('#export').submit();
							
							}catch(e){
								if (e.code == DOMException.INVALID_CHARACTER_ERR) {
									msgwiseit("exclamacao", 'Desenho com caracteres invalidos.', 'Ok,fecharmsg()');
									return;
								}
							}
                                    
                        }
                        
                    
                    </script>                    
                    
                    <div class="io-import-export">
                        <!--[if !IE]><!-->
                        <ul class="io-export io-control io-control-list io-horizontal">
                          <li>
                            <a href="javascript:exportDesenho( 'xml' , 'Desenho_${tipoProcesso.codTipoProcesso}' )" class="download" title="Exportar diagrama BPMN">
                              <span class="icon-download"></span>
                            </a>
                          </li>
                          <li>
                            <a href="javascript:exportDesenho( 'svg' , 'Imagem_${tipoProcesso.codTipoProcesso}' )" class="download" title="Exportar imagem SVG" >
                              <span class="icon-picture"></span>
                            </a>
                          </li>
                        </ul>
                        <!--<![endif]-->
                    </div>
                    
                    
                    
                    
                    <div class="io-zoom-controls" style="display:none;">
                        <ul class="io-zoom-reset io-control io-control-list">
                          <li>
                            <button title="Reset zoom" onClick="zoomReset()" >
                              <span class="icon-size-reset"></span>
                            </button>
                          </li>
                        </ul>
                        
                        <ul class="io-zoom io-control io-control-list">
                          <li>
                            <button title="Zoom +" onClick="zoomIn()" id="zooom">
                              <span class="icon-plus"></span>
                            </button>
                          </li>
                          <li>
                            <hr/>
                          </li>
                          <li>
                            <button href title="Zoom -" onClick="zoomOut()">
                              <span class="icon-minus"></span>
                            </button>
                          </li>
                        </ul>
                    </div>
                    



				<ccenter:browser>
                	<ccenter:whenbrowser browser="Trident/7">
					<!-- Internet Explorer 11 -->

   
                            <ccenter:controleacesso>
                                <ccenter:when recurso="CADASTRO DE PROCESSO" permissao="CONSULTAR">
            
                                    <!--******************************************************************
                                            BPMN.IO Modeler versao 0.12
                                    ****************************************************************** -->
            
                                    <script src="/CCenterWeb/scripts/bpmn-js-seed-master/bower_components/bpmn-js/dist/assets/lang/language_br.js"></script>
                                    <script src="/CCenterWeb/scripts/bpmn-js-seed-master/bower_components/bpmn-js/dist/wiseit-modeler-config.js"></script>
                                    
                                    <!-- 
                                    <script script src="/CCenterWeb/scripts/bpmn-js-seed-master/bower_components/bpmn-js/dist/bpmn-viewer.js"></script>
                                    <script>
                                        /* Init versão readonly */
                                        initViewer( '#js-canvas' );
                                    </script>	
                                    -->
                                    
                                    <script src="/CCenterWeb/scripts/bpmn-js-seed-master/bower_components/bpmn-js/dist/bpmn-modeler.js"></script>
                                    <script>
                                        /* init versão editavel */
                                        initModeler( '#js-canvas' ); 
                                    </script>
                                    
                                    <script>
                                    
                                            /* Zoom */
                                            var zoomTela = 1;
                                            function zoomReset(){
                                                zoomTela = 1;
                                                bpmnjs.get('canvas').zoom(zoomTela); 
                                            }
                                            function zoomIn(){
                                                zoomTela += 0.1;
                                                bpmnjs.get('canvas').zoom(zoomTela); 
                                            }
                                            function zoomOut(){
                                                if( zoomTela > 0.6 ){
													zoomTela -= 0.1;
													bpmnjs.get('canvas').zoom(zoomTela); 
												}
                                            }
                                            /* fim Zoom */
                                            
                                            
                                            /* Keyboard */
                                            $('html').keyup(function(e){
                                                //console.log( e.keyCode );
                                                if(e.keyCode == 46) { /* Delete */
                                                
                                                    if( getSelecteds().length == 1 && 
                                                        (	getSelecteds()[0].type == 'bpmn:MessageEventDefinition' ||
                                                            getSelecteds()[0].type == 'bpmn:IntermediateCatchEvent' ||
															getSelecteds()[0].type == 'bpmn:IntermediateThrowEvent' ||
                                                            getSelecteds()[0].type == 'bpmn:DataOutputAssociation' )){
                                                            return false;	
                                                    }									
                                                    
                                                    
                                                    if( getSelecteds().length > 0 )
                                                        msgwiseit("exclamacao", 'Deseja excluir os elementos selecionados?', 'Sim,fecharmsg();removeElementSelected(),N&atilde;o,fecharmsg()');
                                                }
            
                                                if(e.keyCode == 13) { /* Enter */
                                                    if( getSelecteds().length == 1 && isTask( getSelecteds()[0].type ) )
                                                        abrePropiedades( getSelecteds()[0] );	
                                                }									
                                                    
                                            });
                                            /* fim Keyboard */
                                        
                                            /* carrega o grafico */
                                            function importXML(diagram) {
                                                /* limpo um salto de linha do header do xml */
                                                //diagram = diagram.replace(/\r?\n/ , '');
                                                bpmnjs.importXML(diagram, function(err) {
                                                
													flagSalvar = false;
													console.log( 'flagSalvar = false;' );
												
                                                    if (err) {
                                                        return falhou(err);
                                                    }
                                                    
                                                    try {
                                                        bpmnjs.get('canvas').zoom('fit-viewport'); 
                                                        applyStyles();
                                                        if( bpmnjs.get('rules') )	
                                                        injectValidacao();
                                                        showIconesTipoAtividadeOnLoad();		  
                                                        
                                                        return succeso();
                                                    } catch (e) {
                                                        return falhou(e);
                                                    }
                                                    
                                                });
                                            
                                            }
                                            
            
                                            function succeso() {
                                                console.log('Diagrama carregado');
                                                $('.io-zoom-controls').show();
                                                //$('.io-import-export').show();
												setTimeout( function(){ flagSalvar = true; console.log('flagSalvar = true;') } , 2000 );
                                            }
                                            
                                            function falhou(err) {
                                                console.error('Ocorreu um erro carregando o diagrama!');
                                                console.error(err);
                                            }							
            
                                            $( document ).ready(function() {
                                                
                                                /* novo
                                                    /CCenterWeb/scripts/bpmn-js-seed-master/resources/novo.xml
                                                */
                                                /* exemplo 
                                                    /CCenterWeb/scripts/bpmn-js-seed-master/resources/processo.xml
                                                */
                                                //$.get('/CCenterWeb/scripts/bpmn-js-seed-master/resources/mesage.bpmn', importXML , 'text'); 
                                            
                                                /* vazio */
                                                /* carrego o disenho vazio para exibir no aguarde*/
                                                var xml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?><bpmn:definitions xmlns:bpmn=\"http://www.omg.org/spec/BPMN/20100524/MODEL\" xmlns:bpmndi=\"http://www.omg.org/spec/BPMN/20100524/DI\" id=\"Definitions_1\" targetNamespace=\"http://bpmn.io/schema/bpmn\"><bpmn:process id=\"Process_1\" isExecutable=\"false\" /><bpmndi:BPMNDiagram id=\"BPMNDiagram_1\"><bpmndi:BPMNPlane id=\"BPMNPlane_1\" bpmnElement=\"Process_1\" /></bpmndi:BPMNDiagram></bpmn:definitions>";
                                                importXML( xml );  
            
            
                                                Init(); 
                                                
                                            });
            
                                           
                                    
                                    </script>
                                
                                    <!--******************************************************************
                                            Fim BPMN.IO Modeler versao 0.12
                                    ****************************************************************** -->       
                                    
                                </ccenter:when>
                                <ccenter:otherwise>
                                                           
                                    <script>
                                        /* mensagem sem permisao */
                                        $('#js-canvas').html( '<table width="100%" border="0"><tr><td width="20"><img src="/CCenterWeb/images/portal/icones/peq/ico_alertas.gif" /></td><td align="left"><bean:message key="labels.processos.cadastro.workflow.sempermissao"/></td></tr></table>' );
                                    </script>    
                                                            
                                </ccenter:otherwise>
                            </ccenter:controleacesso>


                    <!-- Fim Internet Explorer -->                  
                	</ccenter:whenbrowser>
                    
                    <ccenter:whenbrowser browser="Trident/6">
                            <!-- Internet Explorer 10 --> 	
                            <script>
                                /* mensagem sem permisao */
                                $('#js-canvas').html( '<table width="100%" border="0"><tr><td width="20"><img src="/CCenterWeb/images/portal/icones/peq/ico_alertas.gif" /></td><td align="left"><bean:message key="labels.processos.cadastro.workflow.browser.versao.incompativel"/></td></tr></table>' );
                            </script>                                    
                    </ccenter:whenbrowser>
                    
                    <ccenter:whenbrowser browser="Trident/5">
                            <!-- Internet Explorer 9 -->
                            <script>
                                /* mensagem sem permisao */
                                $('#js-canvas').html( '<table width="100%" border="0"><tr><td width="20"><img src="/CCenterWeb/images/portal/icones/peq/ico_alertas.gif" /></td><td align="left"><bean:message key="labels.processos.cadastro.workflow.browser.versao.incompativel"/></td></tr></table>' );
                            </script>                                    		
                    </ccenter:whenbrowser>           
                </ccenter:browser>                        
                    
    
    
                </fieldset>
                
                <fieldset class="interno" style="height:10px; font-family:Verdana, Geneva, sans-serif; background-color:#F3F3F3">
                	<span id="status"></span>
                </fieldset>

				<table class="barraBotoesTop" border="0" cellspacing="0" cellpadding="0" align="center">
					<tr>
							<td><input type="button" id="Gravar" onClick="saveVisualData( null , 'salvar')" value="<bean:message key="labels.buttons.gravar"/>" class="buttons"/>&#160;</td>
                            <td><input type="button" id="Voltar" onClick="rollback( codTipoProcesso , 'rollback' ); fecharTelaDesenho();" value="<bean:message key="labels.buttons.voltar"/>" class="buttons"/></td>
                    </tr>
				</table>
			</fieldset>            
            
            
			</td>
			<td style="height:11px; background:url(/CCenterWeb/images/conteudo/portal/img_right_conteudo.gif)">&#160;</td>
		</tr>		
		<tr>
			<td style="height:11px"><img alt="" src="/CCenterWeb/images/conteudo/portal/img_conteudo_bottom_left.gif" width="8" height="11" /></td>
			<td style="height:11px; background:url(/CCenterWeb/images/conteudo/portal/img_bottom_conteudo.gif)" colspan="3" nowrap="nowrap"></td>
			<td style="height:11px"><img alt="" src="/CCenterWeb/images/conteudo/portal/img_conteudo_bottom_right.gif" width="8" height="11" /></td>
		</tr>
		</table>
	</td>
</tr>
</table>  


  

  
</body>
</html>

