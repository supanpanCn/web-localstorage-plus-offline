import { isAbsolute ,normalize,join} from 'node:path'
import { existsSync } from 'node:fs'
import helper from './helper';

const srcRE = /\bsrc\s*=\s*(?:"([^"]+)"|'([^']+)'|([^\s'">]+))/i;

export default function analize(html: string,entry:string="/src/main.ts") {
  let entryPath = "";
  let m = helper.scriptRE.exec(html);
  while (Array.isArray(m)) {
    const [script] = m;
    const [_, src] = srcRE.exec(script) || [];
    if (src === entry) {
      entryPath = src;
      break;
    }
    m = helper.scriptRE.exec(html);
  }
  if (entryPath && isAbsolute(entryPath)) {
    const fullPath = normalize(join(process.cwd(),entryPath))
    if(existsSync(fullPath)){
        entryPath = fullPath
        
    }else{
      entryPath = ''
    }
  }
  return {
    html,
    fullEntryPath:entryPath
  }
}

