var test = require('tap').test;
var createWhisper = require('../');
var createGraph = require('miserables').create;

test('it assigns initial class for each node', function(t) {
  var graph = createGraph();
  var whisper = createWhisper(graph);

  graph.forEachNode(checkClassAssigned);

  t.end();

  function checkClassAssigned(node) {
    var nodeClass = whisper.getClass(node.id);
    t.ok(typeof nodeClass === 'number', 'The class is a number for ' + node.id);
  }
});

test('it reduces change rate over time', function(t) {
  var graph = createGraph();
  var whisper = createWhisper(graph);

  whisper.step();

  var lastChangeRate = whisper.getChangeRate();
  t.ok(typeof lastChangeRate === 'number', 'Change rate is a number');
  t.ok(0 <= lastChangeRate && lastChangeRate <= 1, 'Change rate is within [0, 1]');

  whisper.step();

  var newChangeRate = whisper.getChangeRate();
  t.ok(typeof newChangeRate === 'number', 'New change rate is a number');
  t.ok(newChangeRate < lastChangeRate, 'Change rate goes down');

  t.end();
});

test('it can iterate over clusters', function(t) {
  var graph = createGraph();
  var whisper = createWhisper(graph);

  whisper.step();
  whisper.step();
  whisper.forEachCluster(verifyCluster);

  t.end();

  function verifyCluster(cluster) {
    for (var i = 0; i < cluster.nodes.length; ++i) {
      var nodeId = cluster.nodes[i];
      t.equals(whisper.getClass(nodeId), cluster.class, 'Class for node ' + nodeId + ' is valid');
    }
  }
});

test('it can build clusters map', function(t) {
  var graph = createGraph();
  var whisper = createWhisper(graph);

  whisper.step();
  whisper.step();
  var map = whisper.createClusterMap();
  map.forEach(verifyCluster);

  t.end();

  function verifyCluster(clusterNodes, clusterClass) {
    for (var i = 0; i < clusterNodes.length; ++i) {
      var nodeId = clusterNodes[i];
      t.equals(whisper.getClass(nodeId), clusterClass, 'Class for node ' + nodeId + ' is valid');
    }
  }
});
