
function on_search(e){
		var code = (e.keyCode ? e.keyCode : e.which);
		if(code==13){
			
			//champion icon
			var champname = document.getElementById('champsearch2').value;
			if(champname == 'cocaine'){
				champname = document.getElementById('champsearch').value;
				document.getElementById('champsearch2').value = champname;
			}
			var name = champname;
			var icon = document.getElementById('champicon');
			
			//need to grab latest patch number and insert here
			var icon_url = "http://ddragon.leagueoflegends.com/cdn/5.22.3/img/champion/";
			var almost = name.concat(".png");
			icon.src = icon_url.concat(almost);
			
			//splash art
			var splash_url = "http://ddragon.leagueoflegends.com/cdn/img/champion/splash/";
			almost = name.concat("_0.jpg");
			splash_url = splash_url.concat(almost);
			document.body.style.backgroundImage = 'url("'+splash_url+'")';
			
			/*check if result is a 404
			
			var icon = document.getElementById('champicon');
			icon.src = "Icons/nochamp.png";
			console.log("that's not a real champ, silly goose");  "+name+"'s*/
			
			/*transition into base stats screen*/
			document.getElementById('welcometitle').innerHTML = "Nice choice. Now let's get down to business.";
			document.getElementById('welcometext').innerHTML = ""+name+"'s base stats are on the left and their abilities are below. To start planning your build, we'll need some information. Use the tabs on the right to add runes, scores, and items. Your stats and scalings will update as you go.";
			
			document.getElementById('champsearch').style.visibility = 'hidden';
			document.getElementById('champsearch2').style.visibility = 'visible';
			document.getElementById('transbarmid').style.visibility = 'visible';
			document.getElementById('transbox').style.visibility = 'hidden';
			document.getElementById('abilitybox').style.visibility = 'visible';
			
			/*get base stats from API*/
			setTimeout(get_base_stats(), 1);
			setTimeout(change_passive(), 1);
			setTimeout(change_abilities(), 1);
			setTimeout(changePassive(), 1);
		}
}

	
function get_base_stats(){
		var champ_name = "";
		champ_name = $("#champsearch2").val();
		if(champ_name=="cocaine"){
			champ_name = $("#champsearch").val();
		}
		console.log(champ_name);
		$.ajax({
			url: 'https://global.api.pvp.net/api/lol/static-data/na/v1.2/champion?champData=stats&api_key=59080bd8-1d31-44be-8a1e-3ecd9a372501',
			type: 'GET',
			dataType: 'json',
			data:{},
			success: function (json) {
				var champname_nospaces = champ_name.replace(" ", "");
				champname_nospaces = champname_nospaces.toLowerCase().trim();
		
				pass = json.data[champ_name].stats;
				console.log(pass);
		
				var stats = {attackrange:"0",mpperlevel:"0",mp:"0",attackdamage:"0",hp:"0",hpperlevel:"0",attackdamageperlevel:"0",armor:"0",mpregenperlevel:"0",
							 hpregen:"0",critperlevel:"0",spellblockperlevel:"0",mpregen:"0",
							 attackspeedperlevel:"0",spellblock:"0",movespeed:"0",attackspeedoffset:"0",crit:"0",hpregenperlevel:"0",armorperlevel:"0"};
		
				for(var property in stats)
				{
					if(stats.hasOwnProperty(property))
					{
						stats[property]=json.data[champ_name].stats[property];
					}
				}
				
				//document.getElementById("mpperlevel").value=stats.mpperlevel;
				document.getElementById("mana").innerHTML=stats.mp;
				document.getElementById("attackdamage").innerHTML=stats.attackdamage;
				document.getElementById("health").innerHTML=stats.hp;
				//document.getElementById("hpperlevel").value=stats.hpperlevel;
				//document.getElementById("attackdamageperlevel").value=stats.attackdamageperlevel;
				document.getElementById("armor").innerHTML=stats.armor;
				//document.getElementById("mpregenperlevel").value=stats.mpregenperlevel;
				document.getElementById("healthregen").innerHTML=stats.hpregen;
				//document.getElementById("critperlevel").value=stats.critperlevel;
				//document.getElementById("mrperlevel").value=stats.spellblockperlevel;
				document.getElementById("manaregen").innerHTML=stats.mpregen;
				//document.getElementById("attackspeedperlevel").value=stats.attackspeedperlevel;
				document.getElementById("magicresist").innerHTML=stats.spellblock;
				document.getElementById("movespeed").innerHTML=stats.movespeed;
				document.getElementById("criticalchance").innerHTML=stats.crit;
				//document.getElementById("hpregenperlevel").value=stats.hpregenperlevel;
				//document.getElementById("armorperlevel").value=stats.armorperlevel;
				//document.getElementById("attackspeedoffset").value=stats.attackspeedoffset;
			}
		})
}

function change_passive(){
	var champ_name = "";
	champ_name = $("#champsearch2").val();
	if(champ_name=="cocaine"){
		champ_name = $("#champsearch").val();
	}
	if(champ_name !== ""){
	
		$.ajax({
			url:  'https://global.api.pvp.net/api/lol/static-data/na/v1.2/champion?champData=passive&api_key=3f6239b0-97b4-42fa-8d52-63aabb176184',
			type: 'GET',
			dataType: 'json',
			data: {

			},
			success: function (json) {
				var champ_name_nospaces = champ_name.replace(" ", "");
				champ_name_nospaces = champ_name_nospaces.toLowerCase().trim();
				
				<!-- changing passive icon -->
				pass = json.data[champ_name].passive.image.full;
				console.log(pass);
				
				var passive = document.getElementById('passiveicon');
				
				var passive_url = "http://ddragon.leagueoflegends.com/cdn/5.23.1/img/passive/";
				var almost_two = pass.concat(".png");
				passive.src = passive_url.concat(pass);
				
				<!-- passive description -->
				var pass_text = document.getElementById('abilitytext');
				//pass_text.innerHTML = json.data[champ_name].passive.description;
				
				var pass_title = document.getElementById('abilityname');
				pass_title.innerHTML = json.data[champ_name].passive.name;
			},
			error: function (XMLHttpRequest, textStatus, errorThrown) {
				
			}
		});
	}
}

function change_abilities(){
	var champ_name = "";
	champ_name = $("#champsearch2").val();
	if(champ_name=="cocaine"){
		champ_name = $("#champsearch").val();
	}
	if(champ_name !== ""){
	
		$.ajax({
			url:  'https://global.api.pvp.net/api/lol/static-data/na/v1.2/champion?champData=spells&api_key=3f6239b0-97b4-42fa-8d52-63aabb176184',
			type: 'GET',
			dataType: 'json',
			data: {

			},
			success: function (json) {
				var champ_name_nospaces = champ_name.replace(" ", "");
				champ_name_nospaces = champ_name_nospaces.toLowerCase().trim();
				
				
				var abilities= ["", "", "", ""];
				for(i=0; i<4; i++){
		
					abilities[i] = json.data[champ_name].spells[i].image.full;
					console.log(abilities[i]);
				}
				
				
				
				var ability_url = "http://ddragon.leagueoflegends.com/cdn/5.23.1/img/spell/"
				var ab_one = document.getElementById('abilityoneicon');
				var ab_two = document.getElementById('abilitytwoicon');
				var ab_three = document.getElementById('abilitythreeicon');
				var ab_four = document.getElementById('abilityfouricon');
				for(j=0; j<4; j++){
					if(j==0){
						ab_one.src = ability_url.concat(abilities[j]);
					}
					if(j==1){
						ab_two.src = ability_url.concat(abilities[j]);
					}
					if(j==2){
						ab_three.src = ability_url.concat(abilities[j]);
					}
					if(j==3){
						ab_four.src = ability_url.concat(abilities[j]);
					}
				}
			},
			error: function (XMLHttpRequest, textStatus, errorThrown) {
				
			}
		});
	}
}

function changePassive(){
	var champ_name = "";
	champ_name = $("#champsearch2").val();
	if(champ_name=="cocaine"){
		champ_name = $("#champsearch").val();
	}
	if(champ_name !== ""){	
		$.ajax({
			url:  'https://global.api.pvp.net/api/lol/static-data/na/v1.2/champion?champData=passive&api_key=3f6239b0-97b4-42fa-8d52-63aabb176184',
			type: 'GET',
			dataType: 'json',
			data: {},
			success: function (json) {
				
				var champ_name_nospaces = champ_name.replace(" ", "");
				champ_name_nospaces = champ_name_nospaces.toLowerCase().trim();
	
				<!-- passive description -->
				var pass_text = document.getElementById('abilitytext');
				pass_text.innerHTML = json.data[champ_name].passive.description;
							
				var pass_title = document.getElementById('abilityname');
				pass_title.innerHTML = json.data[champ_name].passive.name;
			},
			error: function (XMLHttpRequest, textStatus, errorThrown) {}
		});
	}				
}
		
function changeAbilityOne(){
	var champ_name = "";
	champ_name = $("#champsearch2").val();
	if(champ_name=="cocaine"){
		champ_name = $("#champsearch").val();
	}
	if(champ_name !== ""){
		
		$.ajax({
			url:  'https://global.api.pvp.net/api/lol/static-data/na/v1.2/champion?champData=spells&api_key=3f6239b0-97b4-42fa-8d52-63aabb176184',
			type: 'GET',
			dataType: 'json',
			data: {},
			success: function (json) {
			var champ_name_nospaces = champ_name.replace(" ", "");
			champ_name_nospaces = champ_name_nospaces.toLowerCase().trim();
						
						
			<!-- ability description -->			
			var ab_one_text = document.getElementById('abilitytext');
			
			var ab_one_title = document.getElementById('abilityname');
			ab_one_title.innerHTML = json.data[champ_name].spells[0].name;
						
			<!-- replacing placeholder values with real data -->
			var str = json.data[champ_name].spells[0].tooltip;			
				str = str.replace(/{/g, '').replace(/}/g, '');
				
				var e_array = str.match(/[e][0-9]/g);
				var f_array = str.match(/[f][0-9]/g);
				var a_array = str.match(/[a][0-9]/g);
				
				var varslength;
				
				if(f_array != null && a_array != null){
					varslength = f_array.length + a_array.length;
				}
				if(f_array == null && a_array != null){
					varslength = a_array.length;
				}
				if(a_array == null && f_array != null){
					varslength = f_array.length;
				}
				if(f_array == null && a_array == null){
					varslength = 0;
				}	
						
				if(e_array != null){
					for(i=0; i < e_array.length; i++){
						var e_array_two = [""];
						e_array_two[i] = e_array[i].replace(/\D/g, '');
						e_array_two[i] = Number(e_array_two[i]);
						str = str.replace(e_array[i] , json.data[champ_name].spells[0].effectBurn[e_array_two[i]]);
					}
				}
				
				
				if(f_array != null){
					for(j=0; j < f_array.length; j++){
						for(h=0; h < varslength; h++){
							if(json.data[champ_name].spells[0].vars[h] != undefined){
								if(json.data[champ_name].spells[0].vars[h].key == f_array[j]){
									str = str.replace(f_array[j] , json.data[champ_name].spells[0].vars[h].coeff);
								}
							}
						}
					}
				}
				

				//ability power
				if(a_array != null){
					
					for(k=0; k < a_array.length; k++){
						for(g=0; g < varslength; g++){
							console.log(varslength);
							if(json.data[champ_name].spells[0].vars[g] != undefined){
								if(json.data[champ_name].spells[0].vars[g].key == a_array[k]){
									//str = str.replace(a_array[k] , json.data[champ_name].spells[0].vars[g].coeff);

									var scaling=document.getElementById("abilitypower").innerHTML;
									scaling=scaling*json.data[champ_name].spells[0].vars[g].coeff;
									console.log(scaling);

									str = str.replace(a_array[k], scaling);
								}
							}
						}
						
					}
				}
				ab_one_text.innerHTML = str;
				
			},
			error: function (XMLHttpRequest, textStatus, errorThrown) {
			
			}
		});
	}
}	
function changeAbilityTwo(){
	var champ_name = "";
	champ_name = $("#champsearch2").val();
	if(champ_name=="cocaine"){
		champ_name = $("#champsearch").val();
	}
	if(champ_name !== ""){
	
		$.ajax({
			url:  'https://global.api.pvp.net/api/lol/static-data/na/v1.2/champion?champData=spells&api_key=3f6239b0-97b4-42fa-8d52-63aabb176184',
			type: 'GET',
			dataType: 'json',
			data: {

			},
			success: function (json) {
				var champ_name_nospaces = champ_name.replace(" ", "");
				champ_name_nospaces = champ_name_nospaces.toLowerCase().trim();
				
				<!-- passive description -->
				var ab_two_text = document.getElementById('abilitytext');
				
				var ab_two_title = document.getElementById('abilityname');
				ab_two_title.innerHTML = json.data[champ_name].spells[1].name;
				
				
				<!-- replacing placeholder values with real data -->
				var str = json.data[champ_name].spells[1].tooltip;
				
				str = str.replace(/{/g, '').replace(/}/g, '');
				
				var e_array = str.match(/[e][0-9]/g);
				var f_array = str.match(/[f][0-9]/g);
				var a_array = str.match(/[a][0-9]/g);
				
				var varslength;
				
				if(f_array != null && a_array != null){
					varslength = f_array.length + a_array.length;
				}
				if(f_array == null && a_array != null){
					varslength = a_array.length;
				}
				if(a_array == null && f_array != null){
					varslength = f_array.length;
				}
				if(f_array == null && a_array == null){
					varslength = 0;
				}	
				
				if(e_array != null){
					for(i=0; i < e_array.length; i++){
						console.log(e_array[i]);
						var e_array_two = [""];
						e_array_two[i] = e_array[i].replace(/\D/g, '');
						e_array_two[i] = Number(e_array_two[i]);
						str = str.replace(e_array[i] , json.data[champ_name].spells[1].effectBurn[e_array_two[i]]);
					}
				}
				
				
				if(f_array != null){
					for(j=0; j < f_array.length; j++){
						for(h=0; h < varslength; h++){
							if(json.data[champ_name].spells[1].vars[h] != undefined){
								if(json.data[champ_name].spells[1].vars[h].key == f_array[j]){
									str = str.replace(f_array[j] , json.data[champ_name].spells[1].vars[h].coeff);
								}
							}
						}
					}
				}
				
				if(a_array != null){
					
					for(k=0; k < a_array.length; k++){
						for(g=0; g < varslength; g++){
							if(json.data[champ_name].spells[1].vars[g] != undefined){
								if(json.data[champ_name].spells[1].vars[g].key == a_array[k]){
									//str = str.replace(a_array[k] , json.data[champ_name].spells[1].vars[g].coeff);

									var scaling=document.getElementById("abilitypower").innerHTML;
									scaling=scaling*json.data[champ_name].spells[1].vars[g].coeff;
									console.log(scaling);

									str = str.replace(a_array[k], scaling);
								}
							}
						}
						
					}
				}
				ab_two_text.innerHTML = str;
				
				
			},
			error: function (XMLHttpRequest, textStatus, errorThrown) {
		
			}
		});
	}
}	
function changeAbilityThree(){
	var champ_name = "";
	champ_name = $("#champsearch2").val();
	if(champ_name=="cocaine"){
		champ_name = $("#champsearch").val();
	}
	if(champ_name !== ""){
	
		$.ajax({
			url:  'https://global.api.pvp.net/api/lol/static-data/na/v1.2/champion?champData=spells&api_key=3f6239b0-97b4-42fa-8d52-63aabb176184',
			type: 'GET',
			dataType: 'json',
			data: {

			},
			success: function (json) {
				var champ_name_nospaces = champ_name.replace(" ", "");
				champ_name_nospaces = champ_name_nospaces.toLowerCase().trim();
				
				<!-- passive description -->
				var ab_three_text = document.getElementById('abilitytext');
				
				var ab_three_title = document.getElementById('abilityname');
				ab_three_title.innerHTML = json.data[champ_name].spells[2].name;
				
				<!-- replacing placeholder values with real data -->
				var str = json.data[champ_name].spells[2].tooltip;
				
				str = str.replace(/{/g, '').replace(/}/g, '');
				
				var e_array = str.match(/[e][0-9]/g);
				var f_array = str.match(/[f][0-9]/g);
				var a_array = str.match(/[a][0-9]/g);
				
				var varslength;
				
				if(f_array != null && a_array != null){
					varslength = f_array.length + a_array.length;
				}
				if(f_array == null && a_array != null){
					varslength = a_array.length;
				}
				if(a_array == null && f_array != null){
					varslength = f_array.length;
				}
				if(f_array == null && a_array == null){
					varslength = 0;
				}	
				
				if(e_array != null){
					for(i=0; i < e_array.length; i++){

						var e_array_two = [""];
						e_array_two[i] = e_array[i].replace(/\D/g, '');
						e_array_two[i] = Number(e_array_two[i]);
						str = str.replace(e_array[i] , json.data[champ_name].spells[2].effectBurn[e_array_two[i]]);
					}
				}
				
				
				if(f_array != null){
					for(j=0; j < f_array.length; j++){
						for(h=0; h < varslength; h++){
							if(json.data[champ_name].spells[2].vars[h] != undefined){
								if(json.data[champ_name].spells[2].vars[h].key == f_array[j]){
									str = str.replace(f_array[j] , json.data[champ_name].spells[2].vars[h].coeff);
								}
							}
						}
					}
				}
				
				if(a_array != null){
					
					for(k=0; k < a_array.length; k++){
						for(g=0; g < varslength; g++){
							console.log(json.data[champ_name].spells[2].vars[g].key);
							if(json.data[champ_name].spells[2].vars[g] != undefined){
								if(json.data[champ_name].spells[2].vars[g].key == a_array[k]){
									//str = str.replace(a_array[k] , json.data[champ_name].spells[2].vars[g].coeff);

									setTimeout(getstats, 1000);
									var scaling=document.getElementById("ability power").innerHTML;
									scaling=scaling*json.data[champ_name].spells[2].vars[g].coeff;
									console.log(scaling);

									str = str.replace(a_array[k], scaling);
								}
							}
						}
						
					}
				}
				ab_three_text.innerHTML = str;
				
				
			},
			error: function (XMLHttpRequest, textStatus, errorThrown) {
			
			}
		});
	}
}	
function changeAbilityFour(){
	var champ_name = "";
	champ_name = $("#champsearch2").val();
	if(champ_name=="cocaine"){
		champ_name = $("#champsearch").val();
	}
	if(champ_name !== ""){
	
		$.ajax({
			url:  'https://global.api.pvp.net/api/lol/static-data/na/v1.2/champion?champData=spells&api_key=3f6239b0-97b4-42fa-8d52-63aabb176184',
			type: 'GET',
			dataType: 'json',
			data: {

			},
			success: function (json) {
				var champ_name_nospaces = champ_name.replace(" ", "");
				champ_name_nospaces = champ_name_nospaces.toLowerCase().trim();
				
				<!-- passive description -->
				var ab_four_text = document.getElementById('abilitytext');
				
				var ab_four_title = document.getElementById('abilityname');
				ab_four_title.innerHTML = json.data[champ_name].spells[3].name;
				
				<!-- replacing placeholder values with real data -->
				var str = json.data[champ_name].spells[3].tooltip;
				
				str = str.replace(/{/g, '').replace(/}/g, '');
				
				var e_array = str.match(/[e][0-9]/g);
				var f_array = str.match(/[f][0-9]/g);
				var a_array = str.match(/[a][0-9]/g);
				
				var varslength;
				
				if(f_array != null && a_array != null){
					varslength = f_array.length + a_array.length;
				}
				if(f_array == null && a_array != null){
					varslength = a_array.length;
				}
				if(a_array == null && f_array != null){
					varslength = f_array.length;
				}
				if(f_array == null && a_array == null){
					varslength = 0;
				}	
				
				if(e_array != null){
					for(i=0; i < e_array.length; i++){
						console.log(e_array[i]);
						var e_array_two = [""];
						e_array_two[i] = e_array[i].replace(/\D/g, '');
						e_array_two[i] = Number(e_array_two[i]);
						str = str.replace(e_array[i] , json.data[champ_name].spells[3].effectBurn[e_array_two[i]]);
					}
				}
				
				
				if(f_array != null){
					for(j=0; j < f_array.length; j++){
						for(h=0; h < varslength; h++){
							if(json.data[champ_name].spells[3].vars[h] != undefined){
								if(json.data[champ_name].spells[3].vars[h].key == f_array[j]){
									str = str.replace(f_array[j] , json.data[champ_name].spells[3].vars[h].coeff);
								}
							}
						}
					}
				}
				
				if(a_array != null){
					
					for(k=0; k < a_array.length; k++){
						for(g=0; g < varslength; g++){
							if(json.data[champ_name].spells[3].vars[g] != undefined){
								if(json.data[champ_name].spells[3].vars[g].key == a_array[k]){
									//str = str.replace(a_array[k] , json.data[champ_name].spells[3].vars[g].coeff);

									setTimeout(getstats, 1000);
									var scaling=document.getElementById("ability power").innerHTML;
									scaling=scaling*json.data[champ_name].spells[3].vars[g].coeff;
									console.log(scaling);

									str = str.replace(a_array[k], scaling);
								}
							}
						}
						
					}
				}
				ab_four_text.innerHTML = str;
				
				
			},
			error: function (XMLHttpRequest, textStatus, errorThrown) {
				
			}
		});
	}	
}