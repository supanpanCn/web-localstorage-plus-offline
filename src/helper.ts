import MagicString from "magic-string";

const scriptRE =
  /(<script(?:\s+[a-z_:][-\w:]*(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^"'<>=\s]+))?)*\s*>)(.*?)<\/script>/gis;

function extract(
  code: string,
  initialBody: string,
  i: number,
  flags: string[]
) {
  const queue = [flags[0]];
  let body = initialBody;
  let c = code[i];
  while (code[i]) {
    if (c === flags[0]) {
      queue.push(c);
    } else if (c === flags[1]) {
      queue.shift();
      if (queue.length === 0) {
        body += c;
        break;
      }
    }
    body += c;
    c = code[++i];
  }
  return body;
}

function str(code:string){
    return new MagicString(code)
}

export default {
  scriptRE,
  extract,
  str
};
