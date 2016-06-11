
(function() {

    var champion = window.localStorage.getItem('champname');
    console.log(champion);
    document.getElementById('champsearch2').value = champion;
    
    var name = champion;
    var icon = document.getElementById('champicon');
    
    //need to grab latest patch number and insert here
    var icon_url = "http://ddragon.leagueoflegends.com/cdn/5.22.3/img/champion/";
    var almost = name.concat(".png");
    icon.src = icon_url.concat(almost);
    
    //splash art
    var splash_url = "http://ddragon.leagueoflegends.com/cdn/img/champion/splash/";
    almost = name.concat("_0.jpg");
    splash_url = splash_url.concat(almost);
    document.getElementById('bgimg').src = splash_url;

    //get all the information from the api and display it
    get_base_stats();
    change_passive();
    change_abilities();
    changePassive();
    initializeShop();

    //Event Handlers
    document.getElementById('champsearch2').addEventListener('keypress', function(event) { on_search(event); });
    var filters = document.getElementsByClassName('filter');
    for(var i = 0; i < filters.length; i++){
        filters[i].addEventListener('click', shop_filter);
    }
    var gameinputs = document.getElementsByClassName('gamedatainput');
    for(var i = 0; i < gameinputs.length; i++){
        gameinputs[i].addEventListener('keypress', update_gamedata);
    }
    document.getElementById('nav3').addEventListener('click', display_runes);
    document.getElementById('nav4').addEventListener('click', display_gamedata);
    document.getElementById('nav5').addEventListener('click', display_shop);
    var shop_icons = document.getElementsByClassName('shopicon');
    for(var i = 0; i < shop_icons.length; i++){
        shop_icons[i].addEventListener('click', add_inventory);
        shop_icons[i].addEventListener('mouseover', item_stats);
    }
    var inventory_icons = document.getElementsByClassName('inventoryicon');
    for(var i = 0; i < inventory_icons.length; i++){
        inventory_icons[i].addEventListener('click', remove_inventory);
        inventory_icons[i].addEventListener('mouseover', item_stats);
    }
    var rune_handlers = document.getElementsByClassName('runeselect');
    for(var i = 0; i < rune_handlers.length; i++){
        rune_handlers[i].id = 'runeselect' + i;
        rune_handlers[i].addEventListener('click', highlight_rune);
    }
    document.getElementById('passiveicon').addEventListener('click', changePassive);
    document.getElementById('abilityoneicon').addEventListener('click', changeAbilityOne);
    document.getElementById('abilitytwoicon').addEventListener('click', changeAbilityTwo);
    document.getElementById('abilitythreeicon').addEventListener('click', changeAbilityThree);
    document.getElementById('abilityfouricon').addEventListener('click', changeAbilityFour);
    
    document.body.addEventListener('click', function(event) { test(event); });
    
    document.getElementById('kills').addEventListener('keyup', sum_gold);
    document.getElementById('assists').addEventListener('keyup', sum_gold);
    document.getElementById('minionkills').addEventListener('keyup', sum_gold);
    document.getElementById('barons').addEventListener('keyup', sum_gold);
    document.getElementById('riftheralds').addEventListener('keyup', sum_gold);
    document.getElementById('gametime').addEventListener('keyup', sum_gold);
    document.getElementById('towers').addEventListener('keyup', sum_gold);
    document.getElementById('jungleclears').addEventListener('keyup', sum_gold);
    console.log(document.getElementById('kills').value);
    
    //Game Data Variables 59.4 44.4
    var kill_worth = 300;
    var assist_worth = 125; //50% of kill gold split among everyone who got an assist
    var melee_worth = 19.8;
    var caster_worth = 14.8;
    var siege_worth = 40;
    var baron_worth = 300;
    var riftherald_worth = 50;
    var tower_worth = 125;
    var jungleclear_worth = 402; // does not include red or blue
    var avgminion_worth = 20.54;
    var start_gold = 500;
    var gold_generation = 20.4 / 10; // 20.4 per 10 seconds
    
    function sum_gold(){
        var temp = document.getElementById('kills').value;
        var num_kills = document.getElementById('kills').value;
        var num_assist = document.getElementById('assists').value;
        var num_minions = document.getElementById('minionkills').value;
        var num_barons = document.getElementById('barons').value;
        var num_riftheralds = document.getElementById('riftheralds').value;
        var gametime = document.getElementById('gametime').value;
        var num_towers = document.getElementById('towers').value;
        var num_jungleclears = document.getElementById('jungleclears').value;
        
        //convert gametime to seconds before here -----------
        var total_gold;
        total_gold = start_gold + (kill_worth * num_kills) + (assist_worth * num_assist) + (avgminion_worth * num_minions) + (baron_worth * num_barons) + (riftherald_worth * num_riftheralds) + (gold_generation * gametime) + (tower_worth * num_towers) + (jungleclear_worth * num_jungleclears);
        console.log(total_gold);
        
        var html_gold = document.getElementsByClassName('goldamt');
        for(var i = 0; i < html_gold.length; i++){
            html_gold[i].innerHTML = total_gold;
        }
    }

    function initializeShop(){
        $.ajax({
            url:  'https://global.api.pvp.net/api/lol/static-data/na/v1.2/item?itemListData=all&api_key=5bafa309-a330-491a-aaae-49498b8ea57a',
            type: 'GET',
            dataType: 'json',
            data: {

            },
            success: function (json) {
                var shop_array = [];
                var item_info = [];
                
                for(var key in json.data){
                    if(json.data.hasOwnProperty(key)){	
                        shop_array.push(key);
                        item_info.push(json.data[key]);
                    }
                    for(k=0; k < shop_array.length; k++){
                        if(item_info[k].maps["11"] == false){
                            shop_array.splice(k,1);
                            item_info.splice(k,1);
                        }
                    }
                    for(k=0; k < shop_array.length; k++){
                        if(item_info[k].consumed == true){
                            shop_array.splice(k,1);
                            item_info.splice(k,1);
                        }
                    }
                    for(k=0; k < shop_array.length; k++){
                        if(item_info[k].group == "BootsDistortion"){
                            shop_array.splice(k,1);
                            item_info.splice(k,1);
                        }
                    }
                    for(k=0; k < shop_array.length; k++){
                        if(item_info[k].group == "BootsCaptain"){
                            shop_array.splice(k,1);
                            item_info.splice(k,1);
                        }
                    }
                    for(k=0; k < shop_array.length; k++){
                        if(item_info[k].group == "BootsAlacrity"){
                            shop_array.splice(k,1);
                            item_info.splice(k,1);
                        }
                    }
                    for(k=0; k < shop_array.length; k++){
                        if(item_info[k].group == "BootsFuror"){
                            shop_array.splice(k,1);
                            item_info.splice(k,1);
                        }
                    }
                }
                j=0;
                for(i=0; i<72; i++){
                    var num = i.toString();
                    var shop_icon_string = "shop_icon"
                    var shop_id = shop_icon_string.concat(num);
                    var item_url = "http://ddragon.leagueoflegends.com/cdn/6.10.1/img/item/";
                    var temp = shop_array[j];
                    
                    var mid_shop_array = temp.concat(".png");
                    var shop_source = document.getElementById(shop_id);

                    if(i < shop_array.length){
                        shop_source.src = item_url.concat(mid_shop_array);
                    } else {
                        shop_source.src = "icons/EmptyIcon_Item.png";
                    }
                    j++;
                }
                
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
            }
        });
    }
    function test(e){
        document.body.style.backgroundImage = "url(http://ddragon.leagueoflegends.com/cdn/img/champion/splash/Aatrox_0.jpg)";
    }

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
            document.getElementById('bgimg').src = splash_url;
            
            /*check if result is a 404
            
            var icon = document.getElementById('champicon');
            icon.src = "Icons/nochamp.png";
            console.log("that's not a real champ, silly goose");  "+name+"'s*/
            
            /*transition into base stats screen*/
            document.getElementById('welcometitle').innerHTML = "Nice choice. Now let's get down to business.";
            document.getElementById('welcometext').innerHTML = ""+name+"'s base stats are on the left and their abilities are below. To start planning your build, we'll need some information. Use the tabs on the right to add runes, scores, and items. Your stats and scalings will update as you go.";
            
            
            /*get base stats from API*/
            setTimeout(get_base_stats(), 1);
            setTimeout(change_passive(), 1);
            setTimeout(change_abilities(), 1);
            setTimeout(changePassive(), 1);
            
            $.ajax({
                url:  'https://global.api.pvp.net/api/lol/static-data/na/v1.2/item?itemListData=all&api_key=5bafa309-a330-491a-aaae-49498b8ea57a',
                type: 'GET',
                dataType: 'json',
                data: {

                },
                success: function (json) {
                    var shop_array = [];
                    var item_info = [];
                    
                    for(var key in json.data){
                        if(json.data.hasOwnProperty(key)){	
                            shop_array.push(key);
                            item_info.push(json.data[key]);
                        }
                        for(k=0; k < shop_array.length; k++){
                            if(item_info[k].maps["11"] == false){
                                shop_array.splice(k,1);
                                item_info.splice(k,1);
                            }
                        }
                        for(k=0; k < shop_array.length; k++){
                            if(item_info[k].consumed == true){
                                shop_array.splice(k,1);
                                item_info.splice(k,1);
                            }
                        }
                        for(k=0; k < shop_array.length; k++){
                            if(item_info[k].group == "BootsDistortion"){
                                shop_array.splice(k,1);
                                item_info.splice(k,1);
                            }
                        }
                        for(k=0; k < shop_array.length; k++){
                            if(item_info[k].group == "BootsCaptain"){
                                shop_array.splice(k,1);
                                item_info.splice(k,1);
                            }
                        }
                        for(k=0; k < shop_array.length; k++){
                            if(item_info[k].group == "BootsAlacrity"){
                                shop_array.splice(k,1);
                                item_info.splice(k,1);
                            }
                        }
                        for(k=0; k < shop_array.length; k++){
                            if(item_info[k].group == "BootsFuror"){
                                shop_array.splice(k,1);
                                item_info.splice(k,1);
                            }
                        }
                    }
                    j=0;
                    for(i=0; i<72; i++){
                        var num = i.toString();
                        var shop_icon_string = "shop_icon"
                        var shop_id = shop_icon_string.concat(num);
                        var item_url = "http://ddragon.leagueoflegends.com/cdn/6.8.1/img/item/";
                        var temp = shop_array[j];
                        
                        var mid_shop_array = temp.concat(".png");
                        var shop_source = document.getElementById(shop_id);

                        if(i < shop_array.length){
                            shop_source.src = item_url.concat(mid_shop_array);
                        } else {
                            shop_source.src = "icons/EmptyIcon_Item.png";
                        }
                        j++;
                    }
                    
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    
                }
            });
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
                url: 'https://global.api.pvp.net/api/lol/static-data/na/v1.2/champion?champData=stats&api_key=5bafa309-a330-491a-aaae-49498b8ea57a',
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
                    document.getElementById("mana").innerHTML = Math.round(stats.mp);
                    document.getElementById("attackdamage").innerHTML = Math.round(stats.attackdamage);
                    document.getElementById("health").innerHTML = Math.round(stats.hp);
                    //document.getElementById("hpperlevel").value=stats.hpperlevel;
                    //document.getElementById("attackdamageperlevel").value=stats.attackdamageperlevel;
                    document.getElementById("armor").innerHTML = Math.round(stats.armor);
                    //document.getElementById("mpregenperlevel").value=stats.mpregenperlevel;
                    document.getElementById("healthregen").innerHTML = Math.round(stats.hpregen);
                    //document.getElementById("critperlevel").value=stats.critperlevel;
                    //document.getElementById("mrperlevel").value=stats.spellblockperlevel;
                    document.getElementById("manaregen").innerHTML = Math.round(stats.mpregen);
                    //document.getElementById("attackspeedperlevel").value=stats.attackspeedperlevel;
                    document.getElementById("magicresist").innerHTML = Math.round(stats.spellblock);
                    document.getElementById("movespeed").innerHTML = Math.round(stats.movespeed);
                    document.getElementById("criticalchance").innerHTML = Math.round(stats.crit);
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
                url:  'https://global.api.pvp.net/api/lol/static-data/na/v1.2/champion?champData=passive&api_key=5bafa309-a330-491a-aaae-49498b8ea57a',
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
                url:  'https://global.api.pvp.net/api/lol/static-data/na/v1.2/champion?champData=spells&api_key=5bafa309-a330-491a-aaae-49498b8ea57a',
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
                url:  'https://global.api.pvp.net/api/lol/static-data/na/v1.2/champion?champData=passive&api_key=5bafa309-a330-491a-aaae-49498b8ea57a',
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
                url:  'https://global.api.pvp.net/api/lol/static-data/na/v1.2/champion?champData=spells&api_key=5bafa309-a330-491a-aaae-49498b8ea57a',
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
                url:  'https://global.api.pvp.net/api/lol/static-data/na/v1.2/champion?champData=spells&api_key=5bafa309-a330-491a-aaae-49498b8ea57a',
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
                url:  'https://global.api.pvp.net/api/lol/static-data/na/v1.2/champion?champData=spells&api_key=5bafa309-a330-491a-aaae-49498b8ea57a',
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

                                        //setTimeout(getstats, 1000);
                                        var scaling=document.getElementById("abilitypower").innerHTML;
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
                url:  'https://global.api.pvp.net/api/lol/static-data/na/v1.2/champion?champData=spells&api_key=5bafa309-a330-491a-aaae-49498b8ea57a',
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

                                        //setTimeout(getstats, 1000);
                                        var scaling=document.getElementById("abilitypower").innerHTML;
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

    /*display the shop*/
    function display_runes(){
        console.log('hey');
        document.getElementById('inventory').style.display = 'none';
        document.getElementById('shop').style.display = 'none';
        document.getElementById('filterlist').style.display = 'none';
        document.getElementById('welcometitle').style.display = 'none';
        document.getElementById('welcometext').style.display = 'none';
        document.getElementById('runes').style.display = 'inline-block';
        document.getElementById('gamedata').style.display = 'none';
        document.getElementById('gamedata2').style.display = 'none';
        document.getElementById('gamedatabuffs').style.display = 'none';
        document.getElementById('datadescription').style.display = 'none';
        document.getElementById('datadescription').style.display = 'none';
        document.getElementById('gold1').style.display = 'none';
        document.getElementById('gold2').style.display = 'none';
        
    }
    
    function display_shop(){
        document.getElementById('inventory').style.display = 'inline-block';
        document.getElementById('shop').style.display = 'inline-block';
        document.getElementById('filterlist').style.display = 'inline-block';
        document.getElementById('welcometitle').style.display = 'none';
        document.getElementById('welcometext').style.display = 'none';
        document.getElementById('runes').style.display = 'none';
        document.getElementById('gamedata').style.display = 'none';
        document.getElementById('gamedata2').style.display = 'none';
        document.getElementById('gamedatabuffs').style.display = 'none';
        document.getElementById('datadescription').style.display = 'none';
        document.getElementById('gold1').style.display = 'inline-block';
        document.getElementById('gold2').style.display = 'none';
    }

    function display_gamedata(){
        document.getElementById('inventory').style.display = 'none';
        document.getElementById('shop').style.display = 'none';
        document.getElementById('filterlist').style.display = 'none';
        document.getElementById('welcometitle').style.display = 'none';
        document.getElementById('welcometext').style.display = 'none';
        document.getElementById('runes').style.display = 'none';
        document.getElementById('gamedata').style.display = 'inline-block';
        document.getElementById('gamedata2').style.display = 'inline-block';
        document.getElementById('gamedatabuffs').style.display = 'inline-block';
        document.getElementById('datadescription').style.display = 'inline-block';
        document.getElementById('gold1').style.display = 'none';
        document.getElementById('gold2').style.display = 'inline-block';
    }

    function shop_filter(){
        $.ajax({
            url:  'https://global.api.pvp.net/api/lol/static-data/na/v1.2/item?itemListData=all&api_key=5bafa309-a330-491a-aaae-49498b8ea57a',
            type: 'GET',
            dataType: 'json',
            data: {

            },
            success: function (json) {
                var shop_array = [];
                var item_info = [];
                var tag_info = [];
                var shop_array_modified = [];
                
                for(var key in json.data){
                    if(json.data.hasOwnProperty(key)){	
                        shop_array.push(key);
                        item_info.push(json.data[key]);
                        tag_info.push(json.data[key].tags);
                    }
                }	
                for(k=0; k < shop_array.length; k++){
                    if(item_info[k].maps["11"] == false){
                        shop_array.splice(k,1);
                        item_info.splice(k,1);
                        tag_info.splice(k,1);
                    }
                }
                for(k=0; k < shop_array.length; k++){
                    if(item_info[k].consumed == true){
                        shop_array.splice(k,1);
                        item_info.splice(k,1);
                        tag_info.splice(k,1);
                    }
                }
                for(k=0; k < shop_array.length; k++){
                    if(item_info[k].group == "BootsDistortion"){
                        shop_array.splice(k,1);
                        item_info.splice(k,1);
                        tag_info.splice(k,1);
                    }
                }
                for(k=0; k < shop_array.length; k++){
                    if(item_info[k].group == "BootsCaptain"){
                        shop_array.splice(k,1);
                        item_info.splice(k,1);
                        tag_info.splice(k,1);
                    }
                }
                for(k=0; k < shop_array.length; k++){
                    if(item_info[k].group == "BootsAlacrity"){
                        shop_array.splice(k,1);
                        item_info.splice(k,1);
                        tag_info.splice(k,1);
                    }
                }
                for(k=0; k < shop_array.length; k++){
                    if(item_info[k].group == "BootsFuror"){
                        shop_array.splice(k,1);
                        item_info.splice(k,1);
                        tag_info.splice(k,1);
                    }
                }
                
                var check_health = document.getElementById('health_filter').checked;
                var check_MR = document.getElementById('MR_filter').checked;
                var check_armor = document.getElementById('armor_filter').checked;
                var check_AD = document.getElementById('AD_filter').checked;
                var check_AS = document.getElementById('AS_filter').checked;
                var check_crit = document.getElementById('crit_filter').checked;
                var check_lifesteal = document.getElementById('lifesteal_filter').checked;
                var check_AP = document.getElementById('AP_filter').checked;
                var check_CDR = document.getElementById('CDR_filter').checked;
                var check_mana = document.getElementById('mana_filter').checked;
                var check_mana_regen = document.getElementById('mana_regen_filter').checked;
                var check_MS = document.getElementById('MS_filter').checked;
                
                
                for(k=0; k < shop_array.length; k++){
                    if(check_health == true){
                        
                        for(var tem in tag_info[k]){
                            
                            if(tag_info[k][tem] == 'Health'){
                                shop_array_modified.push(shop_array[k]);
                            }
                            
                        }
                    }
                }
                
                for(k=0; k < shop_array.length; k++){
                    if(check_MR == true){
                        
                        for(var tem in tag_info[k]){
                            
                            if(tag_info[k][tem] == 'SpellBlock'){
                                shop_array_modified.push(shop_array[k]);
                            }
                            
                        }
                    }
                }
                
                for(k=0; k < shop_array.length; k++){
                    if(check_armor == true){
                        
                        for(var tem in tag_info[k]){
                            
                            if(tag_info[k][tem] == 'Armor'){
                                shop_array_modified.push(shop_array[k]);
                            }
                            
                        }
                    }
                }
                
                for(k=0; k < shop_array.length; k++){
                    if(check_AD == true){
                        
                        for(var tem in tag_info[k]){
                            
                            if(tag_info[k][tem] == 'Damage'){
                                shop_array_modified.push(shop_array[k]);
                            }
                            
                        }
                    }
                }

                for(k=0; k < shop_array.length; k++){
                    if(check_AS == true){
                        
                        for(var tem in tag_info[k]){
                            
                            if(tag_info[k][tem] == 'AttackSpeed'){
                                shop_array_modified.push(shop_array[k]);
                            }
                            
                        }
                    }
                }
                
                for(k=0; k < shop_array.length; k++){
                    if(check_crit == true){
                        
                        for(var tem in tag_info[k]){
                            
                            if(tag_info[k][tem] == 'CriticalStrike'){
                                shop_array_modified.push(shop_array[k]);
                            }
                            
                        }
                    }
                }

                for(k=0; k < shop_array.length; k++){
                    if(check_lifesteal == true){
                        
                        for(var tem in tag_info[k]){
                            
                            if(tag_info[k][tem] == 'LifeSteal'){
                                shop_array_modified.push(shop_array[k]);
                            }
                            
                        }
                    }
                }

                for(k=0; k < shop_array.length; k++){
                    if(check_AP == true){
                        
                        for(var tem in tag_info[k]){
                            
                            if(tag_info[k][tem] == 'SpellDamage'){
                                shop_array_modified.push(shop_array[k]);
                            }
                            
                        }
                    }
                }
                
                for(k=0; k < shop_array.length; k++){
                    if(check_CDR == true){
                        
                        for(var tem in tag_info[k]){
                            
                            if(tag_info[k][tem] == 'CooldownReduction'){
                                shop_array_modified.push(shop_array[k]);
                            }
                            
                        }
                    }
                }

                for(k=0; k < shop_array.length; k++){
                    if(check_mana == true){
                        
                        for(var tem in tag_info[k]){
                            
                            if(tag_info[k][tem] == 'Mana'){
                                shop_array_modified.push(shop_array[k]);
                            }
                            
                        }
                    }
                }
                
                for(k=0; k < shop_array.length; k++){
                    if(check_mana_regen == true){
                        
                        for(var tem in tag_info[k]){
                            
                            if(tag_info[k][tem] == 'ManaRegen'){
                                shop_array_modified.push(shop_array[k]);
                            }
                            
                        }
                    }
                }
                
                for(k=0; k < shop_array.length; k++){
                    if(check_MS == true){
                        
                        for(var tem in tag_info[k]){
                            
                            if(tag_info[k][tem] == 'NonbootsMovement' || tag_info[k][tem] == 'Boots'){
                                shop_array_modified.push(shop_array[k]);
                            }
                            
                        }
                    }
                }



                    
                
                j=0;
                for(i=0; i<72; i++){
                    if(shop_array_modified[j] != undefined){
                        var num = i.toString();
                        var shop_icon_string = "shop_icon"
                        var shop_id = shop_icon_string.concat(num);
                        var item_url = "http://ddragon.leagueoflegends.com/cdn/6.10.1/img/item/";
                        var temp = shop_array_modified[j];
                        var mid_shop_array = temp.concat(".png");
                        
                        var shop_source = document.getElementById(shop_id);
                        shop_source.src = item_url.concat(mid_shop_array);
                        j++;
                    }else{
                        var num = i.toString();
                        var shop_icon_string = "shop_icon"
                        var shop_id = shop_icon_string.concat(num);
                        
                        var shop_source = document.getElementById(shop_id);
                        shop_source.src = "icons/EmptyIcon_Item.png";
                        j++;
                    }

                }
                
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert("error filtering the shop");
            }
        });
    }

    function add_inventory(){ 
        var item_bought = false;
        var shop_image = document.getElementById(this.id);
        var clicked_image = shop_image.src;
        var iven_zero = document.getElementById('inventory_item0');
        var iven_one = document.getElementById('inventory_item1');
        var iven_two = document.getElementById('inventory_item2');
        var iven_three = document.getElementById('inventory_item3');
        var iven_four = document.getElementById('inventory_item4');
        var iven_five = document.getElementById('inventory_item5');
        
        var zero_src = iven_zero.src;
        var one_src = iven_one.src;
        var two_src = iven_two.src;
        var three_src = iven_three.src;
        var four_src = iven_four.src;
        var five_src = iven_five.src;

        var src_temp_zero = zero_src.substr(zero_src.length - 25, zero_src.length);
        var src_temp_one = one_src.substr(one_src.length - 25, one_src.length);
        var src_temp_two = two_src.substr(two_src.length - 25, two_src.length);
        var src_temp_three = three_src.substr(three_src.length - 25, three_src.length);
        var src_temp_four = four_src.substr(four_src.length - 25, four_src.length);
        var src_temp_five = five_src.substr(five_src.length - 25, five_src.length);
        
        var empty_item = "/icons/EmptyIcon_Item.png";
        if(src_temp_zero == empty_item){
            iven_zero.src = clicked_image;
            item_bought = true;
        }else{
            if(src_temp_one == empty_item){
                iven_one.src = clicked_image;
                item_bought = true;
            }else{
                if(src_temp_two == empty_item){
                    iven_two.src = clicked_image;
                    item_bought = true;
                }else{
                    if(src_temp_three == empty_item){
                        iven_three.src = clicked_image;
                        item_bought = true;
                    }else{
                        if(src_temp_four == empty_item){
                            iven_four.src = clicked_image;
                            item_bought = true;
                        }else{
                            if(src_temp_five == empty_item){
                                iven_five.src = clicked_image;
                                item_bought = true;
                            }
                        }
                    }
                }
            }	
        }

        var item_id = clicked_image;
        item_id = item_id.substr(item_id.length - 8);
        item_id = item_id.slice(0,4);
        
        var gold_temp = [];
        var gold_totals = document.getElementsByClassName('goldamt');
        for(var i = 0; i < gold_totals.length; i++){
            gold_temp[i] = gold_totals[i].innerHTML;
            gold_temp[i] = parseInt(gold_temp[i], 10);
        }
        
        item_url = "https://global.api.pvp.net/api/lol/static-data/na/v1.2/item/" + item_id + "?itemData=all&api_key=5bafa309-a330-491a-aaae-49498b8ea57a";
        
        if(item_bought === true){
            $.ajax({
                url:  item_url,
                type: 'GET',
                dataType: 'json',
                data: {

                },
                success: function (json) {	
                    console.log(json.gold.total);
                    console.log(gold_temp);
                    for(var i = 0; i < gold_totals.length; i++){
                        gold_totals[i].innerHTML = gold_temp[i] - json.gold.total;
                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    alert("error getting Item data!");
                }
            });
        }else{
        }
    }
    
    function update_gamedata(){
    }
    
    function remove_inventory(){
        var inven_image = document.getElementById(this.id);
        var image_source = inven_image.src;
        inven_image.src = "icons/EmptyIcon_Item.png";
        
        var remove_id = image_source;
        remove_id = remove_id.substr(remove_id.length - 8);
        remove_id = remove_id.slice(0,4);
        
        item_url = "https://global.api.pvp.net/api/lol/static-data/na/v1.2/item/" + remove_id + "?itemData=all&api_key=5bafa309-a330-491a-aaae-49498b8ea57a";
    }

    function item_stats(){
        var inven_image = document.getElementById(this.id);
        var image_source = inven_image.src;
        
        var stats = document.getElementById('hoverinfo');
            
        var item_id = image_source;
        item_id = item_id.substr(item_id.length - 8);
        item_id = item_id.slice(0,4);
        
        item_url = "https://global.api.pvp.net/api/lol/static-data/na/v1.2/item/" + item_id + "?itemData=all&api_key=5bafa309-a330-491a-aaae-49498b8ea57a";
        
        
        var src_temp = image_source.substr(image_source.length - 25, image_source.length);

            
        
        if(src_temp != "/icons/EmptyIcon_Item.png"){
            $.ajax({
                url:  item_url,
                type: 'GET',
                dataType: 'json',
                data: {

                },
                success: function (json) {	
                    //console.log(json.gold.total);
                    stats.innerHTML = "Gold: " + json.gold.total + "      |      " + json.sanitizedDescription;
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    alert("error getting Summoner data!");
                }
            });
        }else{
            stats.innerHTML = "Empty Item Slot"
        }
    }
    
    function highlight_rune(){
        var selected_rune = document.getElementById(this.id);
        console.log(selected_rune.style.border);
        if(selected_rune.style.border !== '1px solid rgb(242, 242, 242)'){
            selected_rune.style.border = '1px solid #f2f2f2';
        } else {
            selected_rune.style.border = '1px solid #666699';
        }
    }
})();
