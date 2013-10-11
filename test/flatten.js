var tape = require('tape');
var Arborist = require('../');

///////////////////////////////////////////

tape('flatten - no children', function(t) {
  t.plan(1);
  
  var input = {
    childNodes: [
      {
        id: 'one'
      }
    ]
  };
  
  var expected = [
    {
      id: 'one'
    }
  ];

  var arborist = new Arborist;
  var output = arborist.flatten(input);
  t.equal(JSON.stringify(output),
          JSON.stringify(expected));
});

///////////////////////////////////////////

tape('flatten - one child', function(t) {
  t.plan(1);
  
  var input = {
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
  
  var expected = [
    {
      id: 'one'
    }, {
      id: 'two', parent: 'one'
    }
  ];

  var arborist = new Arborist;
  var output = arborist.flatten(input);
  t.equal(JSON.stringify(output),
          JSON.stringify(expected));
});

///////////////////////////////////////////

tape('flatten - two children', function(t) {
  t.plan(1);
  
  var input = {
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
  
  var expected = [
    {
      id: 'one'
    }, {
      id: 'two', parent: 'one'
    }, {
      id: 'three', parent: 'one'
    }
  ];

  var arborist = new Arborist;
  var output = arborist.flatten(input);
  t.equal(JSON.stringify(output),
          JSON.stringify(expected));
});

///////////////////////////////////////////

tape('flatten - nested children', function(t) {
  t.plan(1);
  
  var input = {
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
  
  var expected = [
    {
      id: 'one'
    }, {
      id: 'two', parent: 'one'
    }, {
      id: 'three', parent: 'two'
    }
  ];

  var arborist = new Arborist;
  var output = arborist.flatten(input);
  t.equal(JSON.stringify(output),
          JSON.stringify(expected));
});

///////////////////////////////////////////

tape('flatten - mix linear and nested', function(t) {
  t.plan(1);
  
  var input = {
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
  
  var expected = [
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

  var arborist = new Arborist;
  var output = arborist.flatten(input);
  t.equal(JSON.stringify(output),
          JSON.stringify(expected));
});

///////////////////////////////////////////

tape('flatten - generate parent ids', function(t) {
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
  
  var expected = [
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

  var arborist = new Arborist;
  var output = arborist.flatten(input);
  t.equal(JSON.stringify(output),
          JSON.stringify(expected));
});
