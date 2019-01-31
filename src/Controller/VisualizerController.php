<?php

namespace Drupal\dependency_visualizer\Controller;

use Drupal\Core\Controller\ControllerBase;
use Symfony\Component\Yaml\Yaml;

/**
 * Class VisualizerController.
 */
class VisualizerController extends ControllerBase {

  /**
   * Visualize.
   *
   * @return array
   *   Returns the visualizer.
   */
  public function visualize() {
    $modules = [];
    $dependencies = [];
    /** @var \Drupal\Core\Extension\Extension $extension */
    foreach (\Drupal::moduleHandler()->getModuleList() as $extension) {
      $moduleName = $extension->getName();
      $modules[] = $moduleName;
      $dependencies[$moduleName] = $this->parseDependencies($moduleName, $extension->getType());
    }
    $test = 2;
    return [
      'network' => [
        '#type' => 'container',
        '#attributes' => ['id' => 'network'],
      ],
      'selection' => [
        '#type' => 'container',
        '#attributes' => ['id' => 'selection'],
      ],
      '#attached' => [
        'library' => [
          'dependency_visualizer/visualizer',
        ],
        'drupalSettings' => [
          'dependency_visualizer' => [
            'nodes' => $modules,
            'edges' => $dependencies,
          ],
        ],
      ],
    ];
  }

  /** Parses dependencies of a specific module
   *
   * @param $module
   *
   * @return array
   */
  private function parseDependencies($module, $type): array {
    $filename = drupal_get_path($type, $module) . "/$module.info.yml";
    $info = Yaml::parseFile($filename);
    if ($type === 'profile') {
      return $this->cleanModuleName($info['install']);
    }
    return $this->cleanModuleName($info['dependencies']);
  }

  private function cleanModuleName($modules) {
    $cleaned = [];
    foreach ($modules as $module) {
      $clean = explode(':', $module)[1] ?? $module;
      $cleaned[] = explode(' ', $clean)[0] ?? $module;
    }
    return $cleaned;
  }
}
