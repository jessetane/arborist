# Arborist
Build, flatten and walk trees.

[![browser support](https://ci.testling.com/jessetane/arborist.png)](https://ci.testling.com/jessetane/arborist)

## Why
Needed a way to visualize hierarchical data stored as a flat list.

## How
The module exports a single class `Arborist`. It allows you to:
* transform datasets from flat lists to hierarchical trees and back again
* recursively walk and transform hierarchical data structures

Make yourself an instance:
```
var Arborist = require('arborist');
var arborist = new Arborist;
```
If you're starting with list data, use `parent` and `id` to describe a hierarchy:
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

## Methods
* `build(nodelist)` returns a tree created from an array
* `flatten(node)` returns an array created from a tree
* `walk(node)` recursively walks a tree

## Overridables
#### Event-like
* `willWalkNode(node)` called before any child node walking takes place
* `didWalkNode(node)` called after all child nodes have been walked
* `willWalkChildNode(node, parent, siblings)` called while walking a list of child nodes - `siblings` provides a way to make branch modifications
* `didWalkChildNode(node, parent, siblings)` called after all of a child's child nodes have been walked

#### Return value required
* `resolveNode(node)` if your node has `id` & `parent` but is wrapped in another object, you can override this to unwrap it
* `resolveNodeId(node)` if your nodes don't have `node.id` you need to implement this and return something unique
* `resolveNodeParentId(node)` if your nodes don't have `node.parent` you need to implement this

## Get it
`npm install aborist`

## Test it
`npm test`
Runs a bash script that in turn runs the tests in node, then in your browser using [browserify](https://github.com/substack/node-browserify) - if your system doesn't have bash you can still do `node test` or maybe port the script to node.

## License
[WTFPL](http://www.wtfpl.net/txt/copying/)