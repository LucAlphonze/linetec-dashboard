db.auth("rootAdmin", "rootAdminPwd");

db = db.getSiblingDB("mqtt");

db.createUser({
  user: "linetec",
  pwd: "q%2BKQ*%40%402-%40gU4Ew",
  roles: [{ role: "readWrite", db: "mqtt" }],
});
db.auth("linetec", "q%2BKQ*%40%402-%40gU4Ew");

db.roles.insertOne({
  _id: ObjectId("64d3cdd575d7a2df083079bd"),
  name: "admin",
  __v: 0,
});

db.roles.insertOne({
  _id: ObjectId("64f1f60e918724a5f931d909"),
  name: "user",
  __v: 0,
});

db.users.insertOne({
  _id: ObjectId("64d3cdfe75d7a2df083079c1"),
  username: "Admin",
  name: "admin",
  password: "Admin123$",
  email: "admin@mail.com",
  role: ObjectId("64d3cdd575d7a2df083079bd"),
  isActive: active,
  __v: 0,
});

db.users.insertOne({
  _id: ObjectId("64f1efb6918724a5f931d8ef"),
  username: "usuario",
  name: "usuario",
  password: "Admin123$",
  email: "usuario@mail.com",
  isActive: active,
  __v: 0,
  role: ObjectId("64f1f60e918724a5f931d909"),
});

db.triggers.insertOne({
  nombre: "cambio-valor",
  descripcion:
    "variables con este trigger solo seran insertadas si su valor es distinto del ultimo registro",
});

db.triggers.insertOne({
  nombre: "cambio-tiempo",
  descripcion:
    "variables con este trigger solo seran insertadas si ha pasado determinado tiempo desde el ultimo registro",
});
db.triggers.insertOne({
  nombre: "cambio-porcentaje",
  descripcion:
    "variables con este trigger solo seran insertadas si su valor es x% distinto del ultimo registro",
});

db.triggers.insertOne({
  nombre: "sin-filtro",
  descripcion:
    "variables con este trigger seran insertadas sin ningun tipo de filtro",
});
