/**
 *  Arborist
 */

module.exports = Arborist;

function Arborist() {}

Arborist.prototype.build = function(nodelist, parent) {
  if (parent) {
    var resolvedParent = this.resolveNode
                       ? this.resolveNode(parent)
                       : parent;
    var parentId = this.resolveNodeId 
                 ? this.resolveNodeId(parent) 
                 : resolvedParent.id;
    if (isFalsy(parentId)) {
      return parent;
    }
  }
  for (var i=0; i<nodelist.length; i++) {
    var node = nodelist[i];
    if (node !== parent) {
      var resolvedNode = this.resolveNode 
                       ? this.resolveNode(node)
                       : node;
      var nodeParentId = this.resolveNodeParentId
                       ? this.resolveNodeParentId(node)
                       : resolvedNode.parent;
      if (nodeParentId === parentId) {
        this.build(nodelist, node);
        parent = parent ? parent : {};
        parent.childNodes = parent.childNodes || [];
        parent.childNodes.push(extend({}, node));
      }
    }
  }
  return parent;
};

Arborist.prototype.flatten = function(node, nodelist) {
  nodelist = nodelist || [];
  if (node.childNodes) {
    var resolvedNode = this.resolveNode
                     ? this.resolveNode(node)
                     : node;
    var parentId = this.resolveNodeId 
                 ? this.resolveNodeId(node) 
                 : resolvedNode.id;
    for (var i=0; i<node.childNodes.length; i++) {
      var child = extend({}, node.childNodes[i]);
      var resolvedChild = this.resolveNode
                        ? this.resolveNode(child)
                        : child;
      if (!isFalsy(parentId)) {
        resolvedChild.parent = parentId;  // NOTE: i'm assuming it's useful to inject a 'parent' field when flattening in case there wasn't one already
      }
      nodelist.push(child);
      this.flatten(child, nodelist);
    }
    delete node.childNodes;
  }
  return nodelist;
};

Arborist.prototype.walk = function(node) {
  this.willWalkNode && this.willWalkNode(node);
  if (node.childNodes) {
    var nodelist = [];
    for (var i=0; i<node.childNodes.length; i++) {
      var child = node.childNodes[i];
      this.willWalkChildNode && this.willWalkChildNode(child, node, nodelist);
      nodelist.push(child);
      this.walk(child);
      this.didWalkChildNode && this.didWalkChildNode(child, node, nodelist);
    }
    node.childNodes = nodelist;
  }
  this.didWalkNode && this.didWalkNode(node);
};

function extend(origin, add) {
  if (!add || typeof add !== 'object') return origin;
  var keys = Object.keys(add);
  var i = -1;
  while (++i < keys.length) {
    origin[keys[i]] = add[keys[i]];
  }
  return add;
}

function isFalsy(obj) {
  return obj === undefined
      || obj === null
      || obj === false;
}
