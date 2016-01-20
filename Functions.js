
function on_search(e){
		var code = (e.keyCode ? e.keyCode : e.which);
		if(code==13){
			
			//champion icon
			var champname = document.getElementById('champsearch');
			var name = champname.value;
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
			console.log("that's not a real champ, silly goose"); */
			
			/*transition into base stats screen*/
			document.getElementById('pagetitle').innerHTML = "Nice choice. Here's "+name+"'s Base Stats.";
			document.getElementById('paragraph').innerHTML = "To add runes, calculate gold, and create your build, use the tabs on the right side " +
															 "of the screen. Your stats will update as you go--you can come back and view them at any time.";
			document.getElementById('transbarleft').style.visibility = 'visible';
			document.getElementById('transbarmid').style.visibility = 'visible';
			document.getElementById('transbarright').style.visibility = 'visible';
			document.getElementById('transbarmid_row2').style.visibility = 'visible';
			document.getElementById('searchicon').src = '';
			
			/*get base stats from API*/
			setTimeout(get_base_stats(), 1);
		}
}

	
function get_base_stats(){
		var champ_name = "";
		champ_name = $("#champsearch").val();
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
		
				//i know this looks janky, and it is, so i have no excuse
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