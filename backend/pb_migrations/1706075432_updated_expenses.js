/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("vsnxw1nukncgb9d")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "zncdj0vy",
    "name": "user",
    "type": "relation",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "_pb_users_auth_",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": null
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("vsnxw1nukncgb9d")

  // remove
  collection.schema.removeField("zncdj0vy")

  return dao.saveCollection(collection)
})
