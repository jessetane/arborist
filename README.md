# Arborist
Build, flatten and walk trees.

# Why
Sometimes it's convenient to have hierarchical data in linear list form, sometimes it's not. This module lets you transform your data from a linear list to a hierarchical tree and back again.

# How
The module exports a single class `Arborist`. Make your self an instance:
```
var Arborist = require('arborist');
var arborist = new Arborist;
```
If you're starting with linear data, use `parent` and `id` to describe a hierarchy:
```
var data = [
  {
    id: 1
  }, {
    id: 2
    parent: 1
  }
];
```
Then use your instance to build a tree from it:
```
var tree = arborist.build(data);
console.log(JSON.stringify(tree, null, 2));
// {
//   "childNodes": [
//     {
//       "id": 1,
//       "childNodes": [
//         {
//           "id": 2,
//           "parent": 1
//         }
//       ]
//     }
//   ]
// }
```
Of course, you can also go the other way:
```
arborist.flatten(tree);
```
If you already have data in a tree, you can recursively walk each node and even safely transform branches:
```
var tree = {
  "childNodes": [
    {
      "id": 1,
      "childNodes": [
        {
          "id": 2,
          "parent": 1
        }
      ]
    }
  ]
};

// attach a handler:
arborist.didWalkChildNode = function(node, parent, siblings) {
  
  // look for a specific node
  if (node.id === 2) {
  
    // remove it
    siblings.pop();
  
    // add a new node
    siblings.push({ id: '3', status: 'newfangled' });
  }
};

// ambulate
arborist.walk(tree);
console.log(JSON.stringify(tree, null, 2));
// {
//   "childNodes": [
//     {
//       "id": 1,
//       "childNodes": [
//         {
//           "id": 3,
//           "status": "newfangled",
//         }
//       ]
//     }
//   ]
// }
```

# Methods
* `build(nodelist)` returns a tree created from an array
* `flatten(node)` returns an array created from a tree
* `walk(node)` recursively walks a tree firing events for modifying nodes and / or their child nodelists

# To override
* `resolveNode(node)` if your node has `id` & `parent` but is wrapped in another object, you can override this to unwrap it
* `resolveNodeId(node)` if your nodes don't have `node.id` you need to implement this and return something unique
* `resolveNodeParentId(node)` if your nodes don't have `node.parent` you need to implement this

# Events
NOTE: For simplicity, handlers are just methods you attach to your instances - I'm open to extending `EventEmitter` though
* `willWalkNode(node)` called before any child node walking takes place
* `didWalkNode(node)` called after all child nodes have been walked
* `willWalkChildNode(node, parent, siblings)` called while walking a list of child nodes - this gives you inject or remove child nodes
* `didWalkChildNode(node, parent, siblings)` called after all of a child's child nodes have been walked

# Get it
`npm install aborist`

# Test it (in node and your browser)
`npm test`

# License
WTFPL