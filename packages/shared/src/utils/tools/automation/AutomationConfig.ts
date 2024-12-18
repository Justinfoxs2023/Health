import * as fs from 'fs-extra';
import * as path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export class AutomationConfig {
  private static readonly ROOT_DIR = process.cwd();
  private static readonly CONFIG_FILE = 'automation.config.json';

  static async init() {
    const configPath = path.join(this.ROOT_DIR, this.CONFIG_FILE);

    if (!(await fs.pathExists(configPath))) {
      await fs.writeJson(
        configPath,
        {
          scripts: {
            precommit: ['lint-staged', 'npm test'],
            build: ['tsc', 'react-native bundle'],
            deploy: ['fastlane beta'],
          },
          paths: {
            source: 'src',
            build: 'build',
            docs: 'docs',
            tests: 'tests',
          },
          hooks: {
            'pre-commit': 'npm run precommit',
            'pre-push': 'npm test',
          },
        },
        { spaces: 2 },
      );
    }
  }

  static async runScript(scriptName: string) {
    const config = await fs.readJson(path.join(this.ROOT_DIR, this.CONFIG_FILE));
    const scripts = config.scripts[scriptName];

    if (!scripts) {
      throw new Error(`Script "${scriptName}" not found`);
    }

    for (const script of scripts) {
      await execAsync(script);
    }
  }
}
