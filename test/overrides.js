var tape = require('tape');
var Arborist = require('../');

///////////////////////////////////////////

tape('overrides - type coercion', function(t) {
  t.plan(2);
  
  var input = [
    {
      id: 1
    }, {
      id: 2,
      parent: '1'
    }
  ];
  
  var expected = {
    childNodes: [
      {
        id: 1,
        childNodes: [
          {
            id: 2,
            parent: '1'
          }
        ]
      }
    ]
  };

  var arborist = new Arborist;
  arborist.resolveNodeParentId = function(node) {
    if (node && node.parent !== undefined) {
      return Number(node.parent);
    }
  };
  
  var output = arborist.build(input);
  t.equal(JSON.stringify(output),
          JSON.stringify(expected));

  output = arborist.flatten(output);
  t.equal(JSON.stringify(output),
          JSON.stringify(input));
});

///////////////////////////////////////////

tape('overrides - parameter extraction', function(t) {
  t.plan(2);
  
  var input = [
    {
      wrapped: { id: 'one' }
    }, {
      wrapped: { id: 'two', parent: 'one' }
    }, {
      id: 'three', parent: 'two'  // child, but not wrapped
    }, {
      wrapped: { id: 'four' }
    }, {
      wrapped: { id: 'five', parent: 'four' }
    }, {
      wrapped: { id: 'six', parent: 'five' }
    }, {
      wrapped: { id: 'seven', parent: 'four' }
    }, {
      id: 'eight' // not wrapped
    }
  ];
  
  var expected = {
    childNodes: [
      {
        wrapped: { id: 'one' },
        childNodes: [
          {
            wrapped: { id: 'two', parent: 'one' },
            childNodes: [
              {
                id: 'three',
                parent: 'two'
              }
            ]
          }
        ]
      }, {
        wrapped: { id: 'four' },
        childNodes: [
          {
            wrapped: { id: 'five', parent: 'four' },
            childNodes: [
              {
                wrapped: { id: 'six', parent: 'five' }
              }
            ]
          }, {
            wrapped: { id: 'seven', parent: 'four' }
          }
        ]
      }, {
        id: 'eight'
      }
    ]
  };

  var arborist = new Arborist;
  arborist.resolveNode = function(node) {
    return node.wrapped || node;
  };
  
  var output = arborist.build(input);
  t.equal(JSON.stringify(output),
          JSON.stringify(expected));
          
  output = arborist.flatten(output);
  t.equal(JSON.stringify(output),
          JSON.stringify(input));
});

///////////////////////////////////////////

tape('overrides - complex', function(t) {
  t.plan(2);
  
  var input = [
    {
      wrapped: { id: 'one' }
    }, {
      wrapped: { id: 'two' },     // only id is wrapped
      parent: 'one'
    }, {
      id: 'three', parent: 'two'  // child, but not wrapped
    }, {
      wrapped: { id: 'four' }
    }, {
      id: 'five',                 // only parent is wrapped
      wrapped: { parent: 'four' }
    }, {
      wrapped: { id: 'six', parent: 'five' }
    }, {
      wrapped: { id: 'seven', parent: 'four' }
    }, {
      id: 'eight'                 // not wrapped
    }
  ];
  
  var expected = {
    childNodes: [
      {
        wrapped: { id: 'one' },
        childNodes: [
          {
            wrapped: { id: 'two' },
            parent: 'one',
            childNodes: [
              {
                id: 'three',
                parent: 'two'
              }
            ]
          }
        ]
      }, {
        wrapped: { id: 'four' },
        childNodes: [
          {
            id: 'five',
            wrapped: { parent: 'four' },
            childNodes: [
              {
                wrapped: { id: 'six', parent: 'five' }
              }
            ]
          }, {
            wrapped: { id: 'seven', parent: 'four' }
          }
        ]
      }, {
        id: 'eight'
      }
    ]
  };

  var arborist = new Arborist;
  arborist.resolveNode = function(node) {
    return node.wrapped || node;
  };
  arborist.resolveNodeId = function(node) {
    if (node.id) return node.id;
    if (node.wrapped) return node.wrapped.id;
  };
  arborist.resolveNodeParentId = function(node) {
    if (node.parent) return node.parent;
    if (node.wrapped) return node.wrapped.parent;
  };
  
  var output = arborist.build(input);
  t.equal(JSON.stringify(output),
          JSON.stringify(expected));
          
  output = arborist.flatten(output);
  t.equal(JSON.stringify(output),
          JSON.stringify(input));
});
