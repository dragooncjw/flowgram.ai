/**
 * Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 */

import path from "path";
import fs from "fs";

import { Project } from "../utils/project"; // Import ProjectInfo
import { traverseRecursiveTsFiles } from "../utils/ts-file";

// Added type definitions
export interface Material {
  name: string;
  type: string;
  path: string;
  [key: string]: any; // For other properties from config.json
}

const _types: string[] = [
  "components",
  "effects",
  "plugins",
  "shared",
  "validate",
  "form-plugins",
  "hooks",
];

export function listAllMaterials(formMaterialSrc: string): Material[] {
  const _materials: Material[] = [];

  for (const _type of _types) {
    // 在 Node.js 中，import.meta.dirname 不可用，可使用 import.meta.url 结合 url 模块来获取目录路径

    const materialsPath: string = path.join(formMaterialSrc, _type);
    _materials.push(
      ...fs
        .readdirSync(materialsPath)
        .map((_path: string) => {
          if (_path === "index.ts") {
            return null;
          }

          return {
            name: _path, // Assuming the folder name is the material name
            type: _type,
            path: path.join(materialsPath, _path),
          } as Material;
        })
        .filter((material): material is Material => material !== null),
    );
  }

  return _materials;
}

export const getFormMaterialDependencies = (
  formMaterialPath: string,
): Record<string, string> => {
  const packageJsonPath: string = path.join(formMaterialPath, "package.json");
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));

  return packageJson.dependencies;
};

export const copyMaterial = (
  material: Material,
  project: Project,
  formMaterialPath: string,
): {
  packagesToInstall: string[];
} => {
  const formMaterialDependencies =
    getFormMaterialDependencies(formMaterialPath);

  const sourceDir: string = material.path;
  const materialRoot: string = path.join(
    project.projectPath,
    "src",
    "form-materials",
    `${material.type}`,
  );
  const targetDir = path.join(materialRoot, material.name);
  const packagesToInstall: Set<string> = new Set();

  fs.cpSync(sourceDir, targetDir, { recursive: true });

  for (const file of traverseRecursiveTsFiles(targetDir)) {
    for (const importDeclaration of file.imports) {
      const { source } = importDeclaration;

      if (source.startsWith("@/")) {
        // is inner import
        console.log(
          `Replace Import from ${source} to @flowgram.ai/form-materials`,
        );
        file.replaceImport(
          [importDeclaration],
          [{ ...importDeclaration, source: "@flowgram.ai/form-materials" }],
        );
        packagesToInstall.add(
          `@flowgram.ai/form-materials@${project.flowgramVersion}`,
        );
      } else if (!source.startsWith(".") && !source.startsWith("react")) {
        // check if is in form material dependencies
        const [dep, version] =
          Object.entries(formMaterialDependencies).find(([_key]) =>
            source.startsWith(_key),
          ) || [];
        if (!dep) {
          continue;
        }
        if (dep.startsWith("@flowgram.ai/")) {
          packagesToInstall.add(`${dep}@${project.flowgramVersion}`);
        } else {
          packagesToInstall.add(`${dep}@${version}`);
        }
      }
    }
  }

  return {
    packagesToInstall: [...packagesToInstall],
  };
};
