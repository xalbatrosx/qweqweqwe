const { readdirSync } = require("fs"); 
const ascii = require("ascii-table");
const db = require("nrc.db"); 

let table = new ascii("Komutlar");
table.setHeading("Dosya", "Kullanım", "Diğer Kullanımlar", "Yükleme durumu");

module.exports = (client) => {
        const commands = readdirSync(`./Commands/`).filter(file => file.endsWith(".js")); 
        for (let file of commands) { 
            let pull = require(`./Commands/${file}`); 
            if (pull.name) { 
                client.commands.set(pull.name, pull); 
                table.addRow(file, pull.name, pull.aliases, 'Hazır');
                if(!db.has("calisankomut")) { 
                db.set("calisankomut", 1)
            }else{
                db.add("calisankomut", 1)
            }
            } else {
                table.addRow(file, pull.name, pull.aliases, `Hata -> Komut Klasöründe İsim Yazılmamış.`); 
                if(!db.has("calismayankomut")) { 
                    db.set("calismayankomut", 1)
                }else{
                    db.add("calismayankomut", 1)
                }
                continue; 
            }
            if (pull.name && Array.isArray(pull.aliases)) pull.aliases.forEach(alias => client.aliases.set(alias, pull.name)); 
        }
    console.log(table.toString()); 

}