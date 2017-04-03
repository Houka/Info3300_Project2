// Data accessing and parsing script

/* Loads and parses the data files and then supplies the callback with the data in a easy to use form
*/
function loadData(callback){
	d3.csv("CO2Emissions.csv", function(error, data){
		callback(data);
	});
}
