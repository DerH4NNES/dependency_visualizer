/**
 * @file visualizer.js
 *
 * Defines the behavior the dependency visualizer module.
 */
(function ($, Drupal, drupalSettings) {

  'use strict';

  /**
   * Initializes the vis visualizer
   */
  Drupal.behaviors.visualizer = {
    nodes: null,
    edges: null,
    network: null,
    attach: function (context, settings) {
      this.draw();
    },
    destroy: function (context, settings) {
      if (this.network !== null) {
        this.network.destroy();
        this.network = null;
      }
    },
    draw: function (context, settings) {
      this.destroy();
      this.nodes = [];
      this.edges = [];


      let edgeList = drupalSettings.dependency_visualizer.edges;
      let nodeList = drupalSettings.dependency_visualizer.nodes;
      let nodeCount = drupalSettings.dependency_visualizer.nodes.length;

      for (let i = 0; i < nodeCount; i++) {
        let dependencies = edgeList[nodeList[i]];
        this.nodes.push({
          id: i,
          label: String(drupalSettings.dependency_visualizer.nodes[i])
        });
        if(!dependencies.length) continue;




        for (let j = 0; j < dependencies.length; j++) {
          let to = nodeList.indexOf(dependencies[j]);
          this.edges.push({
            from: i,
            to: to,
            arrows: {to: true}
          });
        }
      }

      console.log(drupalSettings.dependency_visualizer.nodes);

      // create a network
      let container = document.getElementById('network');
      let data = {
        nodes: this.nodes,
        edges: this.edges
      };
      //let directionInput = document.getElementById("direction");
      let options = {
        stabilize: false,
        smoothCurves: false,
        improvedLayout: false,
        hierarchical: {
          enabled: true,
          direction: 'UD',
          sortMethod: 'directed',
          edgeMinimization: false,
          //nodeSpacing: 1000,
          //levelSeperation: 250
        },
        height: '1000px',
        width: '3000px',
        treeSpacing: 1,

      };
      this.network = new vis.Network(container, data, options);

      // add event listeners
      this.network.on('select', function (params) {
        document.getElementById('selection').innerHTML = 'Selection: ' + params.nodes;
      });
    }

  };

})(jQuery, Drupal, drupalSettings);






