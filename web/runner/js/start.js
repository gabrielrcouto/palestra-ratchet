$(document).ready(function() {
	//Use funções de start para cada função do site

	//Inicia todas as entidades REST
	for(var propertyName in Rest) {
	   Rest[propertyName].start();
	}

	//Inicia todos os módulos
	for(var propertyName in Modules) {
	   Modules[propertyName].start();
	}

	//Inicia todas as fases
	for(var propertyName in Levels) {
	   Levels[propertyName].start();
	}
});