const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const Rebridge = require('rebridge');
const redis = require('redis');
const rbclient = redis.createClient();
const db = new Rebridge(rbclient, {
	mode: "deasync"
});
console.log(uuidv4);
db.users = [];
db.users.push({
    id:uuidv4(),
	username: "johndoe",
	email: "johndoe@domain.com",
	type: "teacher",
	password: bcrypt.hashSync("johndoepassword",10)
});
db.users.push({
    id:uuidv4(),
	username: "foobar",
	email: "foobar@domain.com",
	type: "teacher",
	password: bcrypt.hashSync("foobarpassword",10)
});
db.users.push({
    id:uuidv4(),
	username: "CapacitorSet",
	email: "CapacitorSet@users.noreply.github.com",
	type: "teacher",
	password: bcrypt.hashSync("CapacitorSetpassword",10)
});
const [me] = db.users.filter(user => user.username === "CapacitorSet");
console.log("Me:", me); // Prints [{username: "CapacitorSet", email: "..."}]
rbclient.quit();
