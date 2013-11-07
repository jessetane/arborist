var tape = require('tape');
var Arborist = require('../');

///////////////////////////////////////////

tape('build - no children', function(t) {
  t.plan(1);
  
  var input = [
    {
      id: 'one'
    }
  ];
  
  var expected = {
    childNodes: [
      {
        id: 'one'
      }
    ]
  };
  
  var arborist = new Arborist;
  var output = arborist.build(input);
  t.equal(JSON.stringify(output),
          JSON.stringify(expected));
});

///////////////////////////////////////////

tape('build - missing ids', function(t) {
  t.plan(1);
  
  var input = [
    {
      nonid: 'one'
    }, {
      nonid: 'two'
    }, {
      id: 'three'
    }, {
      nonid: 'four'
    }
  ];
  
  var expected = {
    childNodes: [
      {
        nonid: 'one'
      }, {
        nonid: 'two'
      }, {
        id: 'three'
      }, {
        nonid: 'four'
      }
    ]
  };
  
  var arborist = new Arborist;
  var output = arborist.build(input);
  t.equal(JSON.stringify(output),
          JSON.stringify(expected));
});

///////////////////////////////////////////

tape('build - one child', function(t) {
  t.plan(1);
  
  var input = [
    {
      id: 'one'
    }, {
      id: 'two', parent: 'one'
    }
  ];
  
  var expected = {
    childNodes: [
      {
        id: 'one',
        childNodes: [
          {
            id: 'two',
            parent: 'one'
          }
        ]
      }
    ]
  };

  var arborist = new Arborist;
  var output = arborist.build(input);
  t.equal(JSON.stringify(output),
          JSON.stringify(expected));
});

///////////////////////////////////////////

tape('build - two children', function(t) {
  t.plan(1);
  
  var input = [
    {
      id: 'one'
    }, {
      id: 'two', parent: 'one'
    }, {
      id: 'three', parent: 'one'
    }
  ];
  
  var expected = {
    childNodes: [
      {
        id: 'one',
        childNodes: [
          {
            id: 'two',
            parent: 'one'
          }, {
            id: 'three',
            parent: 'one'
          }
        ]
      }
    ]
  };

  var arborist = new Arborist;
  var output = arborist.build(input);
  t.equal(JSON.stringify(output),
          JSON.stringify(expected));
});

///////////////////////////////////////////

tape('build - nested children', function(t) {
  t.plan(1);
  
  var input = [
    {
      id: 'one'
    }, {
      id: 'two', parent: 'one'
    }, {
      id: 'three', parent: 'two'
    }
  ];
  
  var expected = {
    childNodes: [
      {
        id: 'one',
        childNodes: [
          {
            id: 'two',
            parent: 'one',
            childNodes: [
              {
                id: 'three',
                parent: 'two'
              }
            ]
          }
        ]
      }
    ]
  };

  var arborist = new Arborist;
  var output = arborist.build(input);
  t.equal(JSON.stringify(output),
          JSON.stringify(expected));
});

///////////////////////////////////////////

tape('build - mixed children', function(t) {
  t.plan(1);
  
  var input = [
    {
      id: 'one'
    }, {
      id: 'two', parent: 'one'
    }, {
      id: 'three', parent: 'two'
    }, {
      id: 'four'
    }, {
      id: 'five', parent: 'four'
    }, {
      id: 'six', parent: 'five'
    }, {
      id: 'seven', parent: 'four'
    }, {
      id: 'eight'
    }
  ];
  
  var expected = {
    childNodes: [
      {
        id: 'one',
        childNodes: [
          {
            id: 'two',
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
        id: 'four',
        childNodes: [
          {
            id: 'five',
            parent: 'four',
            childNodes: [
              {
                id: 'six',
                parent: 'five'
              }
            ]
          }, {
            id: 'seven',
            parent: 'four'
          }
        ]
      }, {
        id: 'eight'
      }
    ]
  };

  var arborist = new Arborist;
  var output = arborist.build(input);
  t.equal(JSON.stringify(output),
          JSON.stringify(expected));
});
