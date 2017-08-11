interface HashesMap {
  [namekey: string]: string;
}

interface AutoHashConfigByFile {
  c: string;
  config: string;
}

interface AutoHashConfigFileProperty {
  file: string;
  name?: string;
}

interface AutoHashConfig {
  files: AutoHashConfigFileProperty[],
  output: {
    file: string;
  };
  len?: number;
  rename?: boolean = false;
  copy?: boolean = false;
}

export default function autoHash(argv: AutoHashConfig): HashesMap;
