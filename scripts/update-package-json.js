const fs = require('fs');
const path = require('path');

const packagesDir = path.join(__dirname, '../packages');
const packages = ['backend', 'frontend', 'shared'];

// 基础依赖配置
const baseDevDependencies = {
  "@types/node": "^16.18.121",
  "@typescript-eslint/eslint-plugin": "^5.0.0",
  "@typescript-eslint/parser": "^5.0.0",
  "eslint": "^8.0.0",
  "prettier": "^2.5.0",
  "typescript": "^4.5.0"
};

// 前端特定依赖
const frontendDependencies = {
  "@health/shared": "1.0.0",
  "react": "^17.0.2",
  "react-dom": "^17.0.2",
  "antd": "^4.16.13",
  "mobx": "^6.3.2",
  "mobx-react-lite": "^3.2.0",
  "@ant-design/plots": "^1.0.0",
  "axios": "^0.24.0",
  "dayjs": "^1.10.7"
};

const frontendDevDependencies = {
  ...baseDevDependencies,
  "@types/react": "^17.0.38",
  "@types/react-dom": "^17.0.11",
  "@vitejs/plugin-react": "^1.0.7",
  "vite": "^2.7.2"
};

// 后端特定依赖
const backendDependencies = {
  "@health/shared": "1.0.0",
  "@nestjs/common": "^8.0.0",
  "@nestjs/core": "^8.0.0",
  "@nestjs/platform-express": "^8.0.0",
  "@nestjs/typeorm": "^8.0.0",
  "typeorm": "^0.3.0",
  "class-validator": "^0.13.0",
  "class-transformer": "^0.5.0",
  "reflect-metadata": "^0.1.13"
};

// 共享模块依赖
const sharedDependencies = {
  "typescript": "^4.5.4",
  "tslib": "^2.3.1",
  "zod": "^3.22.4"
};

const sharedDevDependencies = {
  ...baseDevDependencies,
  "jest": "^27.4.5",
  "@types/jest": "^27.4.0",
  "ts-jest": "^27.1.2"
};

// 更新 package.json 文件
function updatePackageJson(packageName) {
  const packageJsonPath = path.join(packagesDir, packageName, 'package.json');
  const packageJson = require(packageJsonPath);

  // 更新基本信息
  packageJson.name = `@health/${packageName}`;
  packageJson.version = "1.0.0";
  packageJson.private = true;

  // 根据包类型更新依赖
  switch (packageName) {
    case 'frontend':
      packageJson.dependencies = frontendDependencies;
      packageJson.devDependencies = frontendDevDependencies;
      packageJson.scripts = {
        "start": "vite",
        "build": "tsc && vite build",
        "serve": "vite preview",
        "test": "jest",
        "lint": "eslint src --ext ts,tsx"
      };
      break;

    case 'backend':
      packageJson.dependencies = backendDependencies;
      packageJson.devDependencies = baseDevDependencies;
      packageJson.scripts = {
        "build": "nest build",
        "start": "nest start",
        "start:dev": "nest start --watch",
        "start:debug": "nest start --debug --watch",
        "start:prod": "node dist/main",
        "test": "jest",
        "test:watch": "jest --watch",
        "test:cov": "jest --coverage",
        "lint": "eslint src --ext ts"
      };
      break;

    case 'shared':
      packageJson.dependencies = sharedDependencies;
      packageJson.devDependencies = sharedDevDependencies;
      packageJson.main = "./dist/index.js";
      packageJson.types = "./dist/index.d.ts";
      packageJson.scripts = {
        "build": "tsc",
        "watch": "tsc -w",
        "test": "jest"
      };
      break;
  }

  // 写入更新后的 package.json
  fs.writeFileSync(
    packageJsonPath,
    JSON.stringify(packageJson, null, 2),
    'utf8'
  );
  console.log(`Updated ${packageName}/package.json`);
}

// 更新所有包的 package.json
packages.forEach(updatePackageJson); 