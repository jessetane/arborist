var tape = require('tape');
var Arborist = require('../');

///////////////////////////////////////////

tape('walk - will / did walkNode', function(t) {
  t.plan(2);
  
  var input = {
    childNodes: [
      {
        id: 'one',
        childNodes: [
          {
            id: 'two',
            childNodes: [
              {
                id: 'three',
              }
            ]
          }
        ]
      }, {
        id: 'four',
        childNodes: [
          {
            id: 'five',
            childNodes: [
              {
                id: 'six',
              }
            ]
          }, {
            id: 'seven',
          }
        ]
      }, {
        id: 'eight'
      }
    ]
  };

  var willExpected = [
    'one',
    'two',
    'three',
    'four',
    'five',
    'six',
    'seven',
    'eight'
  ];

  var didExpected = [
    'three',
    'two',
    'one',
    'six',
    'five',
    'seven',
    'four',
    'eight'
  ];

  var willOutput = [];
  var didOutput = [];
  var arborist = new Arborist;
  arborist.willWalkNode = function(node) {
    node.id && willOutput.push(node.id);
  };
  arborist.didWalkNode = function(node) {
    node.id && didOutput.push(node.id);
  };
  
  arborist.walk(input);
  t.equal(JSON.stringify(willOutput),
          JSON.stringify(willExpected));
  t.equal(JSON.stringify(didOutput),
          JSON.stringify(didExpected));
});


///////////////////////////////////////////

tape('walk - will / did walkChildNode', function(t) {
  t.plan(2);
  
  var input = {
    childNodes: [
      {
        id: 'one',
        childNodes: [
          {
            id: 'two',
            childNodes: [
              {
                id: 'three',
              }
            ]
          }
        ]
      }, {
        id: 'four',
        childNodes: [
          {
            id: 'five',
            childNodes: [
              {
                id: 'six',
              }
            ]
          }, {
            id: 'seven',
          }
        ]
      }, {
        id: 'eight'
      }
    ]
  };

  var willExpected = [
    'one:undefined',
    'two:one',
    'three:two',
    'four:undefined',
    'five:four',
    'six:five',
    'seven:four',
    'eight:undefined'
  ];

  var didExpected = [
    'three:two',
    'two:one',
    'one:undefined',
    'six:five',
    'five:four',
    'seven:four',
    'four:undefined',
    'eight:undefined'
  ];

  var willOutput = [];
  var didOutput = [];
  var arborist = new Arborist;
  arborist.willWalkChildNode = function(node, parent) {
    node.id && willOutput.push(node.id + ':' + parent.id);
  };
  arborist.didWalkChildNode = function(node, parent) {
    node.id && didOutput.push(node.id + ':' + parent.id);
  };
  
  arborist.walk(input);
  t.equal(JSON.stringify(willOutput),
          JSON.stringify(willExpected));
  t.equal(JSON.stringify(didOutput),
          JSON.stringify(didExpected));
});


///////////////////////////////////////////

tape('walk - transformations', function(t) {
  t.plan(1);
  
  var input = {
    childNodes: [
      {
        id: 'one',
        childNodes: [
          {
            id: 'two',
            childNodes: [
              {
                id: 'three'
              }, {
                id: 'five'
              }
            ]
          }, {
            id: 'six'
          }, {
            id: 'seven'
          }
        ]
      }
    ]
  };

  var expected = {
    childNodes: [
      {
        id: 'one',
        childNodes: [
          {
            id: 'two',
            childNodes: [
              {
                id: 'three'
              }, {
                id: 'four'
              }, {
                id: 'five'
              }
            ]
          }, {
            id: 'seven'
          }
        ]
      }
    ]
  };
  
  var arborist = new Arborist;
  arborist.didWalkChildNode = function(node, parent, siblings) {
    
    // injection
    if (node.id === 'three') {
      siblings.push({ id: 'four' });
    
    // extraction
    } else if (node.id === 'six') {
      siblings.pop();
    }
  };
  
  arborist.walk(input);
  t.equal(JSON.stringify(input),
          JSON.stringify(expected));
});
