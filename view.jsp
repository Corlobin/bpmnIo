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
  
  <link rel="stylesheet" href="/CCenterWeb/scripts/bpmn-js-seed-master/bower_components/bpmn-js/dist/assets/diagram-js.css">
  <link rel="stylesheet" href="/CCenterWeb/scripts/bpmn-js-seed-master/bower_components/bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css"> 
  <link rel="stylesheet" href="/CCenterWeb/scripts/bpmn-js-seed-master/bower_components/bpmn-js/dist/assets/bpmnio-font/css/bpmnio.css"> 
  <link rel="stylesheet" href="/CCenterWeb/scripts/bpmn-js-seed-master/bower_components/bpmn-js/dist/assets/style_custom.css"> 
	
	<script language="Javascript" type="text/javascript">


	var SESSAO_RESOLUCAO_LARGURA_TELA = '${sessionScope.SESSAO_RESOLUCAO_LARGURA_TELA}';
	var SESSAO_RESOLUCAO_ALTURA_TELA = '${sessionScope.SESSAO_RESOLUCAO_ALTURA_TELA}';

	function Init(){
		novaVersaoTipoProcesso( codTipoProcesso , 'novoProcesso' );
	}
	


	function callRest(callbackid, params) {
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
			
			//document.getElementById("myApplet").restError(callbackid,JSON.stringify(m) );
			 alert('error : ' + JSON.stringify(m) )
		};

		params.success = function(t) {
			 //alert(callbackid);
			 //alert(JSON.stringify(t));
			
			//document.getElementById("myApplet").restResponse(callbackid,JSON.stringify(t) );
			
			if( callbackid == 'novoProcesso')
				fecharmsg();
			
			if( t && t != '' )
				setAttribute( callbackid , '_wiseit_codigo' , JSON.stringify(t) );
			//alert( 'att : ' + getAttribute( callbackid , '_wiseit_codigo' ) );			
			
			
		};

		$.ajax(params);
	}


	
	function novaVersaoTipoProcesso(tipo, callbackid) {
		params = {
			type: 'PUT',
			data: '',
			url: "/CCenterWeb/rest/workflow/cadastro/tipoprocesso/"+tipo,
		};

		callRest(callbackid, params);
	}	

	-->
	</script>





</head>
<body class="intro" bgcolor="EFEFEF">

				
                
                <!-- ${sessionScope.SESSAO_RESOLUCAO_ALTURA_TELA}px; -->
                <fieldset class="interno" style="height:800px; background-color:#FFF;">
    
                    <div class="content" id="js-drop-zone" >
                        <div class="canvas" id="js-canvas" style="background-color:#FFF;"  ></div>
                    </div>


                        <!--******************************************************************
                                BPMN.IO Modeler versao 0.12
                        ****************************************************************** -->

                        <link rel="stylesheet" href="/CCenterWeb/scripts/bootstrap/css/bootstrap.min.css">
                        <script src="/CCenterWeb/scripts/bootstrap/js/bootstrap.min.js"></script>
                        
						<style>
                        
							.tooltip{
								position:absolute;
								z-index:1020;
								display:block;
								visibility:visible;
								padding:5px;
								font-size:12px;
								opacity:0;
								filter:alpha(opacity=0)
							}
							.tooltip.in{
								opacity:.8;
								filter:alpha(opacity=80)
							}
							.tooltip.top{
								margin-top:-2px
							}
							.tooltip.right{
								margin-left:2px
							}
							.tooltip.bottom{
								margin-top:2px
							}
							.tooltip.left{
								margin-left:-2px
							}
							.tooltip.top .tooltip-arrow{
								bottom:0;
								left:50%;
								margin-left:-5px;
								border-left:5px solid transparent;
								border-right:5px solid transparent;
								border-top:5px solid #000
							}
							.tooltip.left .tooltip-arrow{
								top:50%;
								right:0;
								margin-top:-5px;
								border-top:5px solid transparent;
								border-bottom:5px solid transparent;
								border-left:5px solid #000
							}
							.tooltip.bottom .tooltip-arrow{
								top:0;
								left:50%;
								margin-left:-5px;
								border-left:5px solid transparent;
								border-right:5px solid transparent;
								border-bottom:5px solid #000
							}
							.tooltip.right .tooltip-arrow{
								top:50%;
								left:0;
								margin-top:-5px;
								border-top:5px solid transparent;
								border-bottom:5px solid transparent;
								border-right:5px solid #000
							}
							.tooltip-inner{
								max-width:200px;
								padding:3px 8px;
								color:#fff;
								text-align:center;
								text-decoration:none;
								background-color:#000;
								-webkit-border-radius:4px;
								-moz-border-radius:4px;
								border-radius:4px
							}
							.tooltip-arrow{
								position:absolute;
								width:0;
								height:0
							}
                        
                        </style>                      
                        

						<script src="/CCenterWeb/scripts/bpmn-js-seed-master/bower_components/bpmn-js/dist/assets/lang/language_br.js"></script>
                        <script src="/CCenterWeb/scripts/bpmn-js-seed-master/bower_components/bpmn-js/dist/wiseit-modeler-config.js"></script>
                        
                        <!-- -->
                        <script script src="/CCenterWeb/scripts/bpmn-js-seed-master/bower_components/bpmn-js/dist/bpmn-viewer.js"></script>
                        <script>
                            /* Init vers�o readonly */
                            initViewer( '#js-canvas' );
                        </script>	
                        
                        <!-- 
                        <script src="/CCenterWeb/scripts/bpmn-js-seed-master/bower_components/bpmn-js/dist/bpmn-modeler.js"></script>
                        <script>
                            /* init vers�o editavel */
                            initModeler( '#js-canvas' ); 
                        </script>
                        -->
                        
                        <script>

               
                            $( document ).ready(function() {

                                function succeso() {
									console.log('Diagrama carregado');
                                }
                                
                                function falhou(err) {
									console.error('Ocorreu um erro carregando o diagrama!');
									console.error(err);
                                }
                                
                                $.get('/CCenterWeb/scripts/bpmn-js-seed-master/resources/mesage.bpmn', function(diagram) {
                                
									bpmnjs.importXML(diagram, function(err) {
									
										if (err) {
											return falhou(err);
										}
										
										try {
											bpmnjs.get('canvas').zoom('fit-viewport'); 
											applyStyles();
											/* salvo os ids de wiseit na class da cada objeto para exibir os hints na versao relatorio */
											classWiseitCodigo();
											/* adiciona os ToolTips */
											addTooltip( '1821' , '<table><tr><td style=\'color:red;\'>Exemplo</td><td>HTML</td></tr><tr><td style=\'color:red;\'>Exemplo</td><td>HTML</td></tr></table>' );
											addTooltip( '1820' , 'Actividade 1980' );

											return succeso();
										} catch (e) {
											return falhou(e);
										}
									});
									
									}, 'text'); 	
                                    
                                    
                                    
                            });
                               
                        
                        </script>
                    
                        <!--******************************************************************
                                Fim BPMN.IO Modeler versao 0.12
                        ****************************************************************** -->       
                        

    
                </fieldset>

  

  
</body>
</html>

